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
uniform vec3 uWaterColor;
uniform vec3 uShoreColor;
// uniform Biome uBiome[7];
uniform float uSeaLevel;
uniform float uBiomeValues[7];
uniform vec3 uBiomeColors[7];

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
  float minDiff = 10000.0;
  vec3 result = vec3(0.0);
  if(value < uSeaLevel) {
    return uBiomeColors[6];
  }

  for (int i = 0; i < 7; i++) {
    float diff = abs(uBiomeValues[i] - value);
    if (diff < minDiff) {
      minDiff = diff;
      result = uBiomeColors[i];
    }
  }
  return result;
}

void main() {
  vec2 pos = vUv * uSize;
  vec2 cell = floor(pos / uCellSize);
  
  // float noise = snoise((cell + uSeed) * uScale);
  // noise = (noise + 1.0) * 0.5;
  float value = fbm(cell + uSeed, uScale, uOctaves, uLacunarity, uPersistance, uRedistribution);
  
  vec3 color = assignColor(value);

  // gl_FragColor = vec4(value, value, value, uOpacity);
  gl_FragColor = vec4(color, uOpacity);

}