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
  vec2 moisturePositionScaled = pos / uSize * uMoistureScale;
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

  float totalNoise = elevationFBM(cellPosition);

  float distFromCenter = length(cellPosition);
  float gradientFactor = 1.0 - pow(distFromCenter / (uSize * 0.5), 2.0);
  gradientFactor = max(0.0, gradientFactor);
  // gradientFactor = mix(totalNoise, gradientFactor, 0.91);


  float finalElevation = uIsIsland ? totalNoise * gradientFactor : totalNoise;

  vElevation = finalElevation;

  // moisture
  float totalNoiseMoisture = moistureFBM(cellPosition);
  // vMoisture = total_noise_moisture * step(0.35, finalElevation); // only apply moisture if height > 0.35 (e.g., land threshold)
  vMoisture = clamp(totalNoiseMoisture, 0.0, 1.0);
  // vec3 newPosition = vec3(cellPosition, finalElevation > 0.3 ? finalElevation * 100.0 : uIsIsland ? 30.0 : 0.0);


  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}