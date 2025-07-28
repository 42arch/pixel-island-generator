#include utils.glsl

uniform float uOpacity;
varying float vElevation;
varying float vMoisture;


void main() {
  float heightValue = pow(vElevation, 1.0);
  float moistureValue = vMoisture;

  vec3 color = getBiomeColor(heightValue, moistureValue);

  gl_FragColor = vec4(color, uOpacity);
  #include <colorspace_fragment>
}