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

void main() {
  vUv = uv;
  vec2 pos = (vUv - 0.5) * uSize;
  vec2 cell = floor(pos / uCellSize);
  
  vec2 cellPos = cell / uSize * uCellSize;
  
  vec2 cellCenter = (cell + 0.5) * uCellSize;

  float islandValue = uIsIsland ? falloff(uIslandPoint, cellCenter, uSize) : 0.0;
  float moisture = fbm(cellPos - uSize * 0.5, uMoistureSeed, uMoistureScale, uMoistureOctaves, uMoistureLacunarity, uMoisturePersistance, uMoistureRedistribution);
  float elevation = fbm(cellPos - uSize * 0.5, uElevationSeed, uElevationScale, uElevationOctaves, uElevationLacunarity, uElevationPersistance, uElevationRedistribution);
  elevation *= (1.0 - islandValue);

  vElevation = elevation;
  vMoisture = moisture;
  vec3 displacedPosition = position + normal * elevation * uSize * 0.5;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}