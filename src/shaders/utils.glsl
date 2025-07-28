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


float mapLinear(float x, float a1, float a2, float b1, float b2) {
  return b1 + (x - a1) * (b2 - b1) / (a2 - a1);
}

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

float falloff(vec2 point, vec2 cell, float size) {
  vec2 realPoint = point;
  float dist = distance(cell, realPoint);
  float maxDistX = (realPoint.x > 0.0) ? -size: size;
  float maxDistY = (realPoint.y > 0.0) ? -size : size;
  float maxDist = distance(vec2(maxDistX, maxDistY) * 0.5, realPoint);
  float t = pow(clamp(dist / maxDist, 0.0, 1.0), 0.5);
  return t;
}


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

    vec3 OCEAN = uOceanColor;
    vec3 SHALLOW_OCEAN = uShallowOceanColor;
    vec3 BEACH = uBeachColor;
    vec3 SUBTROPICAL_DESERT = uSubtropicalDesertColor;
    vec3 TEMPERATE_DESERT = uTemperateDesertColor;
    vec3 GRASSLAND = uGrasslandColor;
    vec3 SHRUBLAND = uShrublandColor;
    vec3 TAIGA = uTaigaColor;
    vec3 TEMPERATE_DECIDUOUS_FOREST = uTemperateDeciduousForestColor;
    vec3 TEMPERATE_RAIN_FOREST = uTemperateRainForestColor;
    vec3 TROPICAL_SEASONAL_FOREST = uTropicalSeasonalForestColor;
    vec3 TROPICAL_RAIN_FOREST = uTropicalRainForestColor;
    vec3 SCORCHED = uScorchedColor;
    vec3 BARE = uBareColor;
    vec3 TUNDRA = uTundraColor;
    vec3 SNOW = uSnowColor;

    if (elevation < 0.2) {
      return elevation < 0.15 ? OCEAN : SHALLOW_OCEAN;
    }

    if (elevation < 0.23) return BEACH;

    if (elevation > 0.8) {
      if (moisture < 0.1) return SCORCHED;
      if (moisture < 0.2) return BARE;
      if (moisture < 0.5) return TUNDRA;
      return SNOW;
    }

    if (elevation > 0.6) {
      if (moisture < 0.33) return TEMPERATE_DESERT;
      if (moisture < 0.66) return SHRUBLAND;
      return TAIGA;
    }

    if (elevation > 0.3) {
      if (moisture < 0.16) return TEMPERATE_DESERT;
      if (moisture < 0.33) return GRASSLAND;
      if (moisture < 0.66) return TEMPERATE_DECIDUOUS_FOREST;
      return TEMPERATE_RAIN_FOREST;
    }

    // elevation <= 0.3
    if (moisture < 0.16) return SUBTROPICAL_DESERT;
    if (moisture < 0.33) return GRASSLAND;
    if (moisture < 0.66) return TROPICAL_SEASONAL_FOREST;
    return TROPICAL_RAIN_FOREST;
}
