float mapLinear(float x, float a1, float a2, float b1, float b2) {
  return b1 + (x - a1) * (b2 - b1) / (a2 - a1);
}

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

float hue2rgb(float p, float q, float t) {
  if (t < 0.0) t += 1.0;
  if (t > 1.0) t -= 1.0;
  if (t < 1.0/6.0) return p + (q - p) * 6.0 * t;
  if (t < 1.0/2.0) return q;
  if (t < 2.0/3.0) return p + (q - p) * (2.0/3.0 - t) * 6.0;
  return p;
}

vec3 hsl2rgb(vec3 hsl) {
  float h = hsl.x;
  float s = hsl.y;
  float l = hsl.z;
  vec3 rgb;

  if (s == 0.0) {
    rgb = vec3(l); // achromatic
  } else {
    float q = l < 0.5 ? l * (1.0 + s) : l + s - l * s;
    float p = 2.0 * l - q;
    rgb.r = hue2rgb(p, q, h + 1.0/3.0);
    rgb.g = hue2rgb(p, q, h);
    rgb.b = hue2rgb(p, q, h - 1.0/3.0);
  }
  return rgb;
}

vec3 rgb2hsl(vec3 rgb) {
  float r = rgb.x;
  float g = rgb.y;
  float b = rgb.z;

  float max_val = max(max(r, g), b);
  float min_val = min(min(r, g), b);

  float h, s, l;

  // Calculate Lightness
  l = (max_val + min_val) / 2.0;

  if (max_val == min_val) {
    h = 0.0; // achromatic (no hue, e.g., grayscale)
    s = 0.0; // achromatic
  } else {
    float d = max_val - min_val;
    s = l > 0.5 ? d / (2.0 - max_val - min_val) : d / (max_val + min_val);

    if (max_val == r) {
      h = (g - b) / d + (g < b ? 6.0 : 0.0);
    } else if (max_val == g) {
      h = (b - r) / d + 2.0;
    } else { // max_val == b
      h = (r - g) / d + 4.0;
    }
    h /= 6.0;
  }

  return vec3(h, s, l);
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
