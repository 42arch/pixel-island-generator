#include noise.glsl

uniform float uSize;
uniform float uCellSize;
uniform float uScale;
uniform float uSeed;
uniform int uOctaves;
uniform float uLacunarity;
uniform float uPersistance;
uniform float uRedistribution;
varying vec2 vUv;
varying float vHeight;

void main() {
  vUv = uv;
  vec2 pos = vUv * uSize;
  vec2 cell = floor(pos / uCellSize);
  
  float height = fbm(cell * uCellSize + uSeed, uScale / uSize * uCellSize, uPersistance, uLacunarity, uRedistribution, uOctaves);
  vHeight = height;
  vec3 displacedPosition = position + normal * height * uSize * 0.5; 

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}