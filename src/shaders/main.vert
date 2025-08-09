#include fbm.glsl
#include utils.glsl

uniform float uSize;
uniform float uWidth;
uniform float uHeight;
uniform float uCellSize;
uniform bool uIslandMode;
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
varying float vElevation;
varying float vMoisture;

void main() {
  vec2 pos = (uv - 0.5) * uSize;
  vec2 cell = floor(pos / uCellSize);
  
  vec2 cellPos = cell * uCellSize;
  vec2 cellPosition = cellPos;
  
  // vec2 cellCenter = (cell + 0.5) * uCellSize;

  // elevation
  float elevation = fbm(cellPosition / uSize, uElevationSeed, uElevationScale, uElevationOctaves, uElevationLacunarity, uElevationPersistance);
  // float distFromCenter = length(cellPosition);
  float distFromCenter = distance(cellPosition, uIslandPoint);
  float gradientFactor = 1.0 - pow(distFromCenter / (min(uWidth, uHeight) * 0.5), 2.0);
  gradientFactor = max(0.0, gradientFactor);
  // gradientFactor = mix(totalNoise, gradientFactor, 0.91);

  float finalElevation = uIslandMode ? elevation * gradientFactor : elevation;

  vElevation = finalElevation;

  // moisture
  float moisture = fbm(cellPosition / uSize, uMoistureSeed, uMoistureScale, uMoistureOctaves, uMoistureLacunarity, uMoisturePersistance);
  vMoisture = clamp(moisture, 0.0, 1.0);
  // vec3 newPosition = vec3(cellPosition, finalElevation > 0.3 ? finalElevation * 100.0 : uIsIsland ? 30.0 : 0.0);


  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}