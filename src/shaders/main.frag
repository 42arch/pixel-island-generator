#include utils.glsl

varying vec2 vUv;
uniform float uSize;
uniform float uCellSize;
uniform float uOpacity;

varying float vElevation;
varying float vMoisture;


void main() {
  vec2 pos = vUv * uSize;
  // vec2 cell = floor(pos / uCellSize);
  float heightValue = pow(vElevation, 1.0);
  float moistureValue = vMoisture;
  vec3 color = assignColor(heightValue, moistureValue);

  // gl_FragColor = vec4(color, uOpacity);
  // gl_FragColor = vec4(vec3(color), uOpacity);

  gl_FragColor = vec4(color, uOpacity);

}