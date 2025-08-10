#include utils.glsl

uniform float uOpacity;
uniform int uStyle;
varying float vElevation;
varying float vMoisture;

// Follow Whittaker Diagram and do some adjustment
// http://pcg.wikidot.com/pcg-algorithm:whittaker-diagram
vec3 getNatural1Style(float elevation, float moisture) {
  vec3 OCEAN                     = vec3(0.165, 0.294, 0.486); // #2a4b7c
  vec3 SHALLOW_OCEAN             = vec3(0.322, 0.612, 0.902); // #529ce6
  vec3 BEACH                     = vec3(0.851, 0.788, 0.639); // #d9c9a3
  vec3 TEMPERATE_DESERT          = vec3(0.859, 0.812, 0.635); // #dbcfa2
  vec3 SHRUBLAND                 = vec3(0.647, 0.714, 0.541); // #a5b68a
  vec3 TAIGA                     = vec3(0.482, 0.612, 0.396); // #7b9c65
  vec3 TEMPERATE_DECIDUOUS_FOREST= vec3(0.369, 0.608, 0.298); // #5e9b4c
  vec3 TEMPERATE_RAIN_FOREST     = vec3(0.216, 0.459, 0.306); // #37754e
  vec3 SUBTROPICAL_DESERT        = vec3(0.882, 0.776, 0.584); // #e1c695
  vec3 GRASSLAND                 = vec3(0.620, 0.796, 0.376); // #9ecb60
  vec3 TROPICAL_SEASONAL_FOREST  = vec3(0.290, 0.541, 0.235); // #4a8a3c
  vec3 TROPICAL_RAIN_FOREST      = vec3(0.145, 0.416, 0.227); // #256a3a
  vec3 SCORCHED                  = vec3(0.235, 0.235, 0.235); // #3c3c3c
  vec3 BARE                      = vec3(0.627, 0.627, 0.627); // #a0a0a0
  vec3 TUNDRA                    = vec3(0.773, 0.788, 0.702); // #c5c9b3
  vec3 SNOW                      = vec3(0.949, 0.961, 0.973); // #f2f5f8

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

  if (moisture < 0.16) return SUBTROPICAL_DESERT;
  if (moisture < 0.33) return GRASSLAND;
  if (moisture < 0.66) return TROPICAL_SEASONAL_FOREST;
  return TROPICAL_RAIN_FOREST;
}

vec3 getNatural2Style(float elevation, float moisture) {
  vec3 OCEAN                     = vec3(0.039, 0.165, 0.42);  // #0067b0
  vec3 SHALLOW_OCEAN             = vec3(0.094, 0.349, 0.788); // #05a7d3
  vec3 BEACH                     = vec3(0.93, 0.86, 0.69); // #f2de9b
  vec3 SUBTROPICAL_DESERT        = vec3(0.93, 0.82, 0.52); // #f2d3ae
  vec3 TEMPERATE_DESERT          = vec3(0.93, 0.85, 0.61); // #f2ddb4
  vec3 GRASSLAND                 = vec3(0.84, 0.87, 0.58); // #d6e2c4
  vec3 SHRUBLAND                 = vec3(0.76, 0.75, 0.58); // #c2cca4
  vec3 TAIGA                     = vec3(0.46, 0.58, 0.50); // #74a56b
  vec3 TEMPERATE_DECIDUOUS_FOREST= vec3(0.38, 0.62, 0.32); // #619562
  vec3 TEMPERATE_RAIN_FOREST     = vec3(0.24, 0.47, 0.33); // #3e7f55
  vec3 TROPICAL_SEASONAL_FOREST  = vec3(0.53, 0.74, 0.40); // #87b96f
  vec3 TROPICAL_RAIN_FOREST      = vec3(0.14, 0.47, 0.32); // #2a7c4f
  vec3 SCORCHED                  = vec3(0.53, 0.47, 0.47); // #8d8d8d
  vec3 BARE                      = vec3(0.73, 0.71, 0.68); //  #b9b9b9
  vec3 TUNDRA                    = vec3(0.85, 0.85, 0.83); // #d9d9d9
  vec3 SNOW                      = vec3(0.95, 0.95, 0.95); // #f5f5f5

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

  if (moisture < 0.16) return SUBTROPICAL_DESERT;
  if (moisture < 0.33) return GRASSLAND;
  if (moisture < 0.66) return TROPICAL_SEASONAL_FOREST;
  return TROPICAL_RAIN_FOREST;
}

vec3 getNaturalDarkStyle(float elevation, float moisture) {
    vec3 OCEAN_DEEP     = vec3(0.08, 0.12, 0.18); // #121825
    vec3 OCEAN_SHALLOW  = vec3(0.12, 0.18, 0.25); // #1e2731
    vec3 COASTLINE      = vec3(0.20, 0.22, 0.26); // #333b48
    vec3 DESERT         = vec3(0.40, 0.35, 0.28); // #665538
    vec3 GRASSLAND      = vec3(0.25, 0.35, 0.20); // #405528
    vec3 FOREST         = vec3(0.15, 0.28, 0.18); // #284728
    vec3 RAINFOREST     = vec3(0.10, 0.22, 0.15); // #1e3126
    vec3 BARE           = vec3(0.25, 0.25, 0.25); // #404040
    vec3 TUNDRA         = vec3(0.35, 0.38, 0.36); // #595959
    vec3 SNOW           = vec3(0.85, 0.88, 0.90); // #d9d9d9
    vec3 MOUNTAIN_PEAK  = vec3(0.60, 0.65, 0.70); // #999999

    if (elevation < 0.2) {
      return elevation < 0.16 ? OCEAN_DEEP : OCEAN_SHALLOW;
    }
    if (elevation < 0.22) return COASTLINE;

    if (elevation > 0.7) {
        if (moisture < 0.2) return BARE;
        if (moisture < 0.5) return TUNDRA;
        return SNOW;
    }
    if (elevation > 0.9) {
        return MOUNTAIN_PEAK;
    }
    if (elevation > 0.4) {
        if (moisture < 0.3) return DESERT;
        if (moisture < 0.6) return GRASSLAND;
        return FOREST;
    }

    if (moisture < 0.25) return DESERT;
    if (moisture < 0.55) return GRASSLAND;
    if (moisture < 0.8) return FOREST;
    return RAINFOREST;
}

void main() {
  float heightValue = pow(vElevation, 1.0);
  float moistureValue = vMoisture;

  vec3 color;

  switch (uStyle) {
    case 1:
      color = getNatural1Style(heightValue, moistureValue);
      break;
    case 2:
      color = getNatural2Style(heightValue, moistureValue);
      break;
    case 3:
      color = getNaturalDarkStyle(heightValue, moistureValue);
      break;
    default:
      color = getNatural1Style(heightValue, moistureValue);
      break;
  }

  gl_FragColor = vec4(color, uOpacity);
  // #include <colorspace_fragment>
}