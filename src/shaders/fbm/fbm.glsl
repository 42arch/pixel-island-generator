#include noise2D.glsl
#include classicnoise2D.glsl

float snoiseWithSeed(vec2 v, float seed) {
  vec2 offset = vec2(
    fract(sin(seed * 12.9898) * 43758.5453),
    fract(sin(seed * 78.233) * 43758.5453)
  );
  return snoise(v + offset);
}

float fbm(vec2 pos, float seed, float scale, int octaves, float lacunarity, float presistence, float redistribution) {
  float result = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  float maxAmplitude = amplitude;

  for(int i=0; i < octaves; i++) {
    float n = snoiseWithSeed(pos * scale * frequency, seed) * amplitude;
    result += (n * 0.5 + 0.5) * amplitude;
    // result += (n + 1.15) / 2.3 * amplitude;
    // result += n * amplitude;
    // result += snoise(pos * scale * frequency) * amplitude;
    frequency *= lacunarity;
    amplitude *= presistence;
    maxAmplitude += amplitude;
  }

  float redistributed = pow(result, redistribution);
  return redistributed / maxAmplitude;
}