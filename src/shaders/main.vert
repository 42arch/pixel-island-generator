#include fbm.glsl
#include utils.glsl

uniform float uSize;
uniform float uCellSize;
uniform bool uPixelate;
uniform int uAnimateDirection;
uniform float uTime;
uniform int uShape;
uniform float uSizeExponent;
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
  vec2 newUv = uv;
  switch (uAnimateDirection) {
    case 1:
      break;
    case 2:
      newUv = vec2(uv.x, uv.y - uTime * 0.03);
      break;
    case 3:
      newUv = vec2(uv.x, uv.y + uTime * 0.03);
      break;
    case 4:
      newUv = vec2(uv.x - uTime * 0.03, uv.y);
      break;
    case 5:
      newUv = vec2(uv.x + uTime * 0.03, uv.y);
      break;
    default:
      break;
  }

  vec2 pos = (newUv - 0.5) * uSize;
  vec2 cell = floor(pos / uCellSize);
  
  vec2 cellPos = cell * uCellSize;
  vec2 cellPosition = uPixelate ? cellPos : pos;
  // vec2 cellCenter = (cell + 0.5) * uCellSize;

  // elevation
  float elevation = fbm(cellPosition / uSize, uElevationSeed, uElevationScale, uElevationOctaves, uElevationLacunarity, uElevationPersistance);

  float dist = 0.0;
  switch (uShape) {
    case 1:
      dist = length(uv - 0.5);
      break;
    case 2:
      dist = max(abs(uv.x - 0.5), abs(uv.y - 0.5));
      break;
    case 3:
      dist = abs(uv.x - 0.5) + abs(uv.y - 0.5);
      break;
    default:
      dist = length(uv - 0.5);
      break;
  }

  float gradient = smoothstep(0.0, sqrt(0.5), dist);
  float finalElevation = elevation * pow(1.0 - gradient, uSizeExponent);

  vElevation = finalElevation;

  // moisture
  float moisture = fbm(cellPosition / uSize, uMoistureSeed, uMoistureScale, uMoistureOctaves, uMoistureLacunarity, uMoisturePersistance);
  vMoisture = clamp(moisture, 0.0, 1.0);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}