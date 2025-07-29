#include noise2D.glsl

float snoiseWithSeed(vec2 v, float seed) {
  vec2 offset = vec2(
    fract(sin(seed * 12.9898) * 43758.5453),
    fract(sin(seed * 78.233) * 43758.5453)
  );
  return snoise(v + offset);
}

float fbm(vec2 pos, float seed, float scale, int octaves, float lacunarity, float persistence) {
  vec2 positionScaled = pos * scale;
  float result = 0.0;
  float amplitude = 1.0;
  float frequency = 1.0;

  for (int i = 0; i < octaves; i++) {
    result += snoiseWithSeed(positionScaled * frequency, seed) * amplitude;
    amplitude *= persistence;
    frequency *= lacunarity;
  }

  result = (result + 1.0) * 0.5;
  return result;
}

// float fbm(vec2 pos, float seed, float scale, int octaves, float lacunarity, float presistence, float redistribution) {
//   float result = 0.0;
//   float amplitude = 1.0;
//   float frequency = 1.0;
//   float maxAmplitude = amplitude;

//   for(int i=0; i < octaves; i++) {
//     float n = snoiseWithSeed(pos * scale * frequency, seed);
//     // result += clamp((n * 0.5 + 0.5), 0.0, 1.0) * amplitude;
//     result += (n * 0.5 + 0.5) * amplitude;
//     // result += n * amplitude;

//     frequency *= lacunarity;
//     amplitude *= presistence;
//     maxAmplitude += amplitude;
//   }

//   float redistributed = pow(result, redistribution);
//   return redistributed / maxAmplitude;
// }