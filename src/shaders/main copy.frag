#include utils.glsl

uniform float uOpacity;
uniform bool uBlendMode;
uniform vec3 uOceanColor;
uniform vec3 uShallowOceanColor;
uniform vec3 uBeachColor;
uniform vec3 uTemperateDesertColor;
uniform vec3 uShrublandColor;
uniform vec3 uTaigaColor;
uniform vec3 uTemperateDeciduousForestColor;
uniform vec3 uTemperateRainForestColor;
uniform vec3 uSubtropicalDesertColor;
uniform vec3 uGrasslandColor;
uniform vec3 uTropicalSeasonalForestColor;
uniform vec3 uTropicalRainForestColor;
uniform vec3 uScorchedColor;
uniform vec3 uBareColor;
uniform vec3 uTundraColor;
uniform vec3 uSnowColor;
varying float vElevation;
varying float vMoisture;

// Follow Whittaker Diagram and do some adjustment
// http://pcg.wikidot.com/pcg-algorithm:whittaker-diagram
vec3 getBiomeColor(float elevation, float moisture) {
  // vec3 OCEAN = vec3(0.039, 0.165, 0.42);
  // vec3 SHALLOW_OCEAN = vec3(0.094, 0.349, 0.788);
  // vec3 BEACH = vec3(0.93, 0.86, 0.69);
  // vec3 SUBTROPICAL_DESERT = vec3(0.93, 0.82, 0.52);
  // vec3 TEMPERATE_DESERT = vec3(0.93, 0.85, 0.61);
  // vec3 GRASSLAND = vec3(0.84, 0.87, 0.58);
  // vec3 SHRUBLAND = vec3(0.76, 0.75, 0.58);
  // vec3 TAIGA = vec3(0.46, 0.58, 0.50);
  // vec3 TEMPERATE_DECIDUOUS_FOREST = vec3(0.38, 0.62, 0.32);
  // vec3 TEMPERATE_RAIN_FOREST = vec3(0.24, 0.47, 0.33);
  // vec3 TROPICAL_SEASONAL_FOREST = vec3(0.53, 0.74, 0.40);
  // vec3 TROPICAL_RAIN_FOREST = vec3(0.14, 0.47, 0.32);
  // vec3 SCORCHED = vec3(0.53, 0.47, 0.47);
  // vec3 BARE = vec3(0.73, 0.71, 0.68);
  // vec3 TUNDRA = vec3(0.85, 0.85, 0.83);
  // vec3 SNOW = vec3(0.95, 0.95, 0.95);

  if (elevation < 0.2) {
    return elevation < 0.15 ? uOceanColor : uShallowOceanColor;
  }

  if (elevation < 0.23) return uBeachColor;

  if (elevation > 0.8) {
    if (moisture < 0.1) return uScorchedColor;
    if (moisture < 0.2) return uBareColor;
    if (moisture < 0.5) return uTundraColor;
    return uSnowColor;
  }

  if (elevation > 0.6) {
    if (moisture < 0.33) return uTemperateDesertColor;
    if (moisture < 0.66) return uShrublandColor;
    return uTaigaColor;
  }

  if (elevation > 0.3) {
    if (moisture < 0.16) return uTemperateDesertColor;
    if (moisture < 0.33) return uGrasslandColor;
    if (moisture < 0.66) return uTemperateDeciduousForestColor;
    return uTemperateRainForestColor;
  }

  // elevation <= 0.3
  if (moisture < 0.16) return uSubtropicalDesertColor;
  if (moisture < 0.33) return uGrasslandColor;
  if (moisture < 0.66) return uTropicalSeasonalForestColor;
  return uTropicalRainForestColor;
}


void main() {
  float heightValue = pow(vElevation, 1.0);
  float moistureValue = vMoisture;

  vec3 color = getBiomeColor(heightValue, moistureValue);

  gl_FragColor = vec4(color, uOpacity);
  #include <colorspace_fragment>
}