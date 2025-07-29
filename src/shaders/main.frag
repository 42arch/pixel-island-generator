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

vec3 ocean(float e) {
  vec3 hsl = rgb2hsl(uOceanColor);
  hsl.z = mapLinear(e, 0.0, 0.16, 0.2, 0.7);
  return hsl2rgb(hsl);
}

vec3 lowland(float m) {
  if (m < 0.16) return uSubtropicalDesertColor;
  if (m < 0.33) return mix(uSubtropicalDesertColor, uGrasslandColor, smoothstep(0.16, 0.20, m));
  if (m < 0.66) return mix(uGrasslandColor, uTropicalSeasonalForestColor, smoothstep(0.33, 0.40, m));
  return mix(uTropicalSeasonalForestColor, uTropicalRainForestColor, smoothstep(0.66, 0.75, m));
}

vec3 midland(float m) {
  if (m < 0.16) return uTemperateDesertColor;
  if (m < 0.33) return mix(uTemperateDesertColor, uGrasslandColor, smoothstep(0.16, 0.20, m));
  if (m < 0.66) return mix(uGrasslandColor, uTemperateDeciduousForestColor, smoothstep(0.33, 0.40, m));
  return mix(uTemperateDeciduousForestColor, uTemperateRainForestColor, smoothstep(0.66, 0.75, m));
}

vec3 highland(float m) {
  if (m < 0.33) return uTemperateDesertColor;
  if (m < 0.66) return mix(uTemperateDesertColor, uShrublandColor, smoothstep(0.33, 0.40, m));
  return mix(uShrublandColor, uTaigaColor, smoothstep(0.66, 0.75, m));
}

vec3 peak(float m) {
  if (m < 0.1) return uScorchedColor;
  if (m < 0.2) return mix(uScorchedColor, uBareColor, smoothstep(0.1, 0.15, m));
  if (m < 0.5) return mix(uBareColor, uTundraColor, smoothstep(0.2, 0.3, m));
  return mix(uTundraColor, uSnowColor, smoothstep(0.5, 0.6, m));
}

vec3 getBlendedBiomeColor(float elevation, float moisture) {
  if (elevation < 0.22) {
    if (elevation < 0.16) {
      // return ocean(elevation);
      return mix(uOceanColor, uShallowOceanColor, smoothstep(0.14, 0.16, elevation));
    } else {
      return mix(uShallowOceanColor, uBeachColor, smoothstep(0.18, 0.22, elevation));
    }
  }

  if (elevation < 0.3) return mix(uBeachColor, lowland(moisture), smoothstep(0.22, 0.25, elevation));
  if (elevation < 0.6) return mix(lowland(moisture), midland(moisture), smoothstep(0.3, 0.4, elevation));
  if (elevation < 0.8) return mix(midland(moisture), highland(moisture), smoothstep(0.6, 0.7, elevation));
  return mix(highland(moisture), peak(moisture), smoothstep(0.8, 0.85, elevation));
}


void main() {
  float heightValue = pow(vElevation, 1.0);
  float moistureValue = vMoisture;

  vec3 color = uBlendMode ? getBlendedBiomeColor(heightValue, moistureValue) : getBiomeColor(heightValue, moistureValue);

  gl_FragColor = vec4(color, uOpacity);
  #include <colorspace_fragment>
}