#include noise2D.glsl

struct Biome {
  float value;
  vec3 color;
};

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
  float total = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  float maxAmplitude = amplitude;

  for(int i=0; i<octaves; i++) {
    total += snoise(pos * scale * frequency) * amplitude;
    frequency *= lacunarity;
    amplitude *= presistence;
    maxAmplitude += amplitude;
  }

  float redistributed = pow(total, redistribution);
  return redistributed / maxAmplitude;
}

vec3 assignColor(float value) {
  float v = value;

  // if(v < uWaterValue) return vec3(0.0, 0.3967552307153359, 1.0);


  if(v <= uWaterValue) return uWaterColor;
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
  float normalizedValue = pow(mapLinear(value, -1.0, 1.0, 0.0, 1.0), 2.0);

  vec3 color = assignColor(normalizedValue);

  // gl_FragColor = vec4(value, value, value, uOpacity);
  gl_FragColor = vec4(color, uOpacity);

}