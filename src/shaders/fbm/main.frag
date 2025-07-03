
varying vec2 vUv;
uniform float uSize;
uniform float uCellSize;
uniform float uOpacity;
uniform float uSeed;
uniform float uScale;
uniform int uOctaves;
uniform float uLacunarity;
uniform float uPersistance;
uniform float uRedistribution;
uniform float uWaterValue;
uniform float uShoreValue;
uniform float uBeachValue;
uniform float uShrubValue;
uniform float uForestValue;
uniform float uStoneValue;
uniform float uSnowValue;
uniform vec3 uWaterColor;
uniform vec3 uShoreColor;
uniform vec3 uBeachColor;
uniform vec3 uShrubColor;
uniform vec3 uForestColor;
uniform vec3 uStoneColor;
uniform vec3 uSnowColor;
varying float vHeight;

float mapLinear(float x, float a1, float a2, float b1, float b2) {
  return b1 + (x - a1) * (b2 - b1) / (a2 - a1);
}

vec3 assignColor(float value) {
  float v = value;


  if(v <= uWaterValue) return uWaterColor;
  else if(v <= uShoreValue) return uShoreColor;
  else if(v <= uBeachValue) return uBeachColor;
  else if(v <= uShrubValue) return uShrubColor;
  else if(v <= uForestValue) return uForestColor;
  else if(v <= uStoneValue) return uStoneColor;
  // else if(v <= uSnowValue) return uSnowColor;
  else return uSnowColor;
}

void main() {
  vec2 pos = vUv * uSize;
  // vec2 cell = floor(pos / uCellSize);
  float heightValue = pow(vHeight, 1.2);
  vec3 color = assignColor(vHeight);

  // gl_FragColor = vec4(color, uOpacity);
  // gl_FragColor = vec4(vec3(color), uOpacity);

  gl_FragColor = vec4(color, uOpacity);

}