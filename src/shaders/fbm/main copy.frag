#include noise2D.glsl
#include classicnoise2D.glsl

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

float mapLinear(float x, float a1, float a2, float b1, float b2) {
  return b1 + (x - a1) * (b2 - b1) / (a2 - a1);
}

float fbm(vec2 pos, float scale, int octaves, float lacunarity, float presistence, float redistribution) {
  float result = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  float maxAmplitude = amplitude;

  for(int i=0; i < octaves; i++) {
    float n = cnoise(pos * scale * frequency) * amplitude;
    // result += (n * 0.5 + 0.5) * amplitude;
    result += n * amplitude;
    // result += snoise(pos * scale * frequency) * amplitude;
    frequency *= lacunarity;
    amplitude *= presistence;
    maxAmplitude += amplitude;
  }

  float redistributed = pow(result, redistribution);
  return redistributed / maxAmplitude;
  // float raw = result / maxAmplitude;
  // float redistributed = pow(raw, redistribution);
  // return redistributed;
}

vec3 assignColor(float value) {
  float v = value;

  if(v <= 0.0) return vec3(0.0);
  if(v >= 1.0) return vec3(1.0);



  else if(v <= uWaterValue) return uWaterColor;
  else if(v <= uShoreValue) return uShoreColor;
  else if(v <= uBeachValue) return uBeachColor;
  else if(v <= uShrubValue) return uShrubColor;
  else if(v <= uForestValue) return uForestColor;
  else if(v <= uStoneValue) return uStoneColor;
  else if(v <= uSnowValue) return uSnowColor;
  else return uSnowColor;
}

void main() {
  vec2 pos = vUv * uSize;
  vec2 cell = floor(pos / uCellSize);
  
  // float noise = snoise((cell + uSeed) * uScale);
  // noise = (noise + 1.0) * 0.5;
  float value = fbm(cell + uSeed, uScale, uOctaves, uLacunarity, uPersistance, uRedistribution);
  float normalizedValue = mapLinear(value, -1.0, 1.0, 0.0, 1.0);

  vec3 color = assignColor(value);

  // gl_FragColor = vec4(color, uOpacity);
  gl_FragColor = vec4(vec3(color), uOpacity);

  // gl_FragColor = vec4(0.0, 0.0, 0.0, uOpacity);

}