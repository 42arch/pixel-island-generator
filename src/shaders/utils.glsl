uniform vec3 uOceanColor;
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

vec3 assignColor(float e, float m) {
  if(e < 0.1) return uOceanColor;
  if(e < 0.11) return uBeachColor;
  if(e > 0.8) {
    if(m < 0.1) return uScorchedColor;
    if(m < 0.2) return uBareColor;
    if(m < 0.5) return uTundraColor;
    return uSnowColor;
  }

  if(e > 0.6) {
    if(m < 0.33) return uTemperateDesertColor;
    if(m < 0.66) return uShrublandColor;
    return uTaigaColor;
  }

  if(e > 0.3) {
    if(m < 0.16) return uTemperateDesertColor;
    if(m < 0.5) return uGrasslandColor;
    if(m < 0.83) return uTemperateDeciduousForestColor;
    return uTemperateRainForestColor;
  }

  if(m < 0.16) return uSubtropicalDesertColor;
  if(m < 0.33) return uGrasslandColor;
  if(m < 0.66) return uTropicalSeasonalForestColor;
  return uTropicalRainForestColor;
}