#include utils.glsl

varying vec2 vUv;
uniform float uSize;
uniform float uCellSize;
uniform float uOpacity;

varying float vElevation;
varying float vMoisture;


void main() {
  vec2 pos = vUv * uSize;
  // vec2 cell = floor(pos / uCellSize);
  float heightValue = pow(vElevation, 1.0);
  float moistureValue = vMoisture;
//   vec3 color = assignColor(heightValue, moistureValue);

  // gl_FragColor = vec4(color, uOpacity);


    vec3 color;

    if (vElevation < 0.2) {
        color = vec3(0.0, 0.2, 0.7); // Deep water
    } else if (vElevation < 0.3) {
        color = vec3(0.1, 0.4, 0.8); // Shallow water
    }
    else {
        if (vElevation < 0.4) { // 低海拔
            if (moistureValue < 0.5) {
                color = vec3(0.9, 0.8, 0.6); // Sand / Beach (沙滩)
            } else {
                color = vec3(0.2, 0.6, 0.2); // Grassland (草地)
            }
        } else if (vElevation < 0.6) { // 中海拔
            if (moistureValue < 0.4) {
                color = vec3(0.7, 0.7, 0.3); // Shrubland / Dry Grass (灌木/干燥草地)
            } else if (moistureValue < 0.7) {
                color = vec3(0.1, 0.5, 0.1); // Forest (森林)
            } else {
                 color = vec3(0.05, 0.3, 0.05); // Lush Forest (茂密森林)
            }
        } else if (vElevation < 0.9) { // 高海拔
            if (moistureValue < 0.5) {
                color = vec3(0.5, 0.5, 0.5); // Rock (岩石)
            } else {
                color = vec3(0.3, 0.4, 0.3); // Tundra / Conifer Forest (苔原/针叶林)
            }
        } else { // 极高海拔
            color = vec3(0.9, 0.9, 0.9); // Snow (雪地)
        }
    }

//   gl_FragColor = vec4(vec3(vElevation), uOpacity);
  gl_FragColor = vec4(color, uOpacity);

}