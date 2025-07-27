#include fbm.glsl
#include utils.glsl

uniform float uSize;
uniform float uCellSize;
uniform bool uIsIsland;
uniform vec2 uIslandPoint;
uniform float uScale;
uniform float uElevationSeed;
uniform float uElevationScale;
uniform int uElevationOctaves;
uniform float uElevationLacunarity;
uniform float uElevationPersistance;
uniform float uElevationRedistribution;
uniform float uMoistureSeed;
uniform float uMoistureScale;
uniform int uMoistureOctaves;
uniform float uMoistureLacunarity;
uniform float uMoisturePersistance;
uniform float uMoistureRedistribution;
varying vec2 vUv;
varying float vElevation;
varying float vMoisture;

float elevationFBM(vec2 pos) {
  vec2 positionScaled = pos / uSize * uElevationScale;
  float result = 0.0;
  float amplitude = 1.0;
  float frequency = 1.0;

  for (int i = 0; i < uElevationOctaves; i++) {
    result += snoiseWithSeed(positionScaled * frequency, uElevationSeed) * amplitude;
    amplitude *= uElevationPersistance;
    frequency *= uElevationLacunarity; // Double frequency for next octave
  }

  result = (result + 1.0) * 0.5;
  return result;
}

float moistureFBM(vec2 pos) {
  vec2 moisturePositionScaled = pos / uSize * uMoistureScale; // 添加偏移量
  float totalNoiseMoisture = 0.0;
  float amplitudeMoisture = 1.0;
  float frequencyMoisture = 1.0;

  for (int i = 0; i < uMoistureOctaves; i++) {
    totalNoiseMoisture += snoiseWithSeed(moisturePositionScaled * frequencyMoisture, uMoistureSeed) * amplitudeMoisture;
    amplitudeMoisture *= uMoisturePersistance;
    frequencyMoisture *= uMoistureLacunarity; // Double frequency for next octave
  }
  totalNoiseMoisture = (totalNoiseMoisture + 1.0) * 0.5;
  return totalNoiseMoisture;
}

void main() {
  vUv = uv;
  vec2 pos = (vUv - 0.5) * uSize;
  vec2 cell = floor(pos / uCellSize);
  
  vec2 cellPos = cell * uCellSize;
  vec2 cellPosition = cellPos;
  
  vec2 cellCenter = (cell + 0.5) * uCellSize;

  float total_noise = elevationFBM(cellPosition);

  float dist_from_center = length(cellPosition);
  float gradient_factor = 1.0 - pow(dist_from_center / 500.0, 2.0); // Adjust 5.0 for island size
  // gradient_factor = max(0.0, gradient_factor);
  // gradient_factor = mix(total_noise, gradient_factor, 0.9);

  gradient_factor = mix(total_noise, gradient_factor, 0.99);


  float final_height = total_noise * gradient_factor;

  vElevation = final_height;

  // moisture
  float totalNoiseMoisture = moistureFBM(cellPosition);
  // v_moisture = total_noise_moisture * step(0.35, final_height); // only apply moisture if height > 0.35 (e.g., land threshold)
  vMoisture = clamp(totalNoiseMoisture, 0.0, 1.0);

  vec3 new_position = vec3(cellPosition, final_height > 0.3 ? final_height * 100.0 : 30.0);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}