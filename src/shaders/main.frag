uniform float u_height_scale;
varying float v_height;
varying float v_moisture; // 接收水分值

void main() {
    vec3 color;

    // --- 水体部分 ---
    if (v_height < 0.2) {
        color = vec3(0.0, 0.2, 0.7); // Deep water
    } else if (v_height < 0.22) {
        color = vec3(0.1, 0.4, 0.8); // Shallow water
    }
    // --- 陆地部分 - 结合高程和水分 ---
    else {
        // 定义生物群落阈值 (可以根据需求调整这些值)
        // 例如：
        // 低海拔，低水分 -> 沙漠 (Desert)
        // 低海拔，高水分 -> 草地/森林 (Grassland/Forest)
        // 中海拔，低水分 -> 稀疏森林/灌木 (Shrubland)
        // 中海拔，高水分 -> 茂密森林 (Forest)
        // 高海拔，低水分 -> 岩石/苔原 (Rock/Tundra)
        // 高海拔，高水分 -> 雪山 (Snow)

        if (v_height < 0.4) { // 低海拔
            if (v_moisture < 0.3) {
                color = vec3(0.9, 0.8, 0.6); // Sand / Beach (沙滩)
            } else {
                color = vec3(0.2, 0.6, 0.2); // Grassland (草地)
            }
        } else if (v_height < 0.6) { // 中海拔
            if (v_moisture < 0.4) {
                color = vec3(0.7, 0.7, 0.3); // Shrubland / Dry Grass (灌木/干燥草地)
            } else if (v_moisture < 0.7) {
                color = vec3(0.1, 0.5, 0.1); // Forest (森林)
            } else {
                 color = vec3(0.05, 0.3, 0.05); // Lush Forest (茂密森林)
            }
        } else if (v_height < 0.8) { // 高海拔
            if (v_moisture < 0.5) {
                color = vec3(0.5, 0.5, 0.5); // Rock (岩石)
            } else {
                color = vec3(0.3, 0.4, 0.3); // Tundra / Conifer Forest (苔原/针叶林)
            }
        } else { // 极高海拔
            color = vec3(0.9, 0.9, 0.9); // Snow (雪地)
        }
    }

    gl_FragColor = vec4(color, 1.0);
}