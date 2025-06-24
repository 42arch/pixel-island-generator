#include noise2D.glsl

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

void main() {
  vec2 pos = vUv * uSize;
  vec2 cell = floor(pos / uCellSize);
  
  // float noise = snoise((cell + uSeed) * uScale);
  // noise = (noise + 1.0) * 0.5;
  float value = fbm(cell + uSeed, uScale, uOctaves, uLacunarity, uPersistance, uRedistribution);
  
  gl_FragColor = vec4(value, value, value, uOpacity);
}