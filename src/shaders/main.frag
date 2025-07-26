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
    // --- 水体部分 ---
    // 参考图片：水体颜色偏蓝，深浅过渡平滑，海岸线不规则
    // 浅水区过渡：看起来像 0.15-0.25 之间
    float water_depth_factor = smoothstep(0.15, 0.25, heightValue); // 更宽的浅水过渡带
    color = mix(vec3(0.0, 0.15, 0.5),   // 更深的蓝色 (深水)
                vec3(0.05, 0.3, 0.7),  // 较亮的蓝色 (浅水)
                water_depth_factor);

    // --- 陆地部分 - 结合高程和水分 ---
    // 陆地开始的阈值，略高于浅水区，确保沙滩出现
    if (heightValue >= 0.22) {
        // 定义关键的生物群落颜色 (根据图片微调)
        vec3 color_beach        = vec3(0.9, 0.8, 0.6);   // 沙滩 (浅黄褐色)
        vec3 color_grassland    = vec3(0.2, 0.55, 0.2);  // 草地 (标准绿色)
        vec3 color_forest_light = vec3(0.15, 0.45, 0.15); // 稀疏森林 (稍深绿)
        vec3 color_forest_dense = vec3(0.08, 0.35, 0.08); // 茂密森林 (更深绿)
        vec3 color_rock         = vec3(0.5, 0.5, 0.5);   // 岩石 (中灰)
        vec3 color_snow         = vec3(0.95, 0.95, 0.95); // 雪山 (接近纯白)
        vec3 color_dry_earth    = vec3(0.6, 0.45, 0.3);  // 干土/苔原 (褐色调，用于高海拔干燥处)

        // 高程归一化（将 heightValue 再次映射到 0-1 范围，以更细致地控制陆地部分）
        // 假设陆地高程范围从 0.22 到 1.0
        float land_elevation = (heightValue - 0.22) / (1.0 - 0.22);
        land_elevation = clamp(land_elevation, 0.0, 1.0); // 确保在 [0, 1]


        // --- 第一层插值：根据水分值在“干”和“湿”之间插值 ---
        // 注意：这里的 moistureValue 已经是经过顶点着色器处理的，只在陆地有效。

        // 低海拔区：沙滩与草地/稀疏森林的过渡
        // 图片显示沙滩在非常低的陆地上，然后迅速过渡到绿色
        float low_moisture_factor = smoothstep(0.2, 0.4, moistureValue); // 调整沙滩到绿色的水分阈值
        vec3 low_altitude_color = mix(color_beach, color_grassland, low_moisture_factor);


        // 中海拔区：草地/稀疏森林到茂密森林的过渡
        // 根据图片，森林区域普遍较多，且有深浅变化
        float mid_moisture_factor = smoothstep(0.4, 0.7, moistureValue); // 控制森林的茂密程度
        vec3 mid_altitude_color = mix(color_grassland, color_forest_dense, mid_moisture_factor);
        // 如果想在中间添加一个“轻度森林”的过渡，可以再加一层mix
        // float mid_moisture_factor_light = smoothstep(0.3, 0.5, moistureValue);
        // mid_altitude_color = mix(color_grassland, color_forest_light, mid_moisture_factor_light);
        // mid_altitude_color = mix(mid_altitude_color, color_forest_dense, smoothstep(0.5, 0.8, moistureValue));


        // 高海拔区：岩石与高山植被（苔原/针叶林）的过渡
        // 图片中高山区域多为灰色岩石，少量地方有绿色/褐色苔原
        float high_moisture_factor = smoothstep(0.3, 0.6, moistureValue); // 控制岩石到苔原/高山植被的水分阈值
        vec3 high_altitude_color = mix(color_rock, color_dry_earth, high_moisture_factor);
        // 如果需要更湿润的高山植被，可以再增加一个颜色和插值
        // high_altitude_color = mix(high_altitude_color, color_conifer_forest, smoothstep(0.6, 0.8, moistureValue));


        // --- 第二层插值：根据高程在不同海拔颜色之间插值 ---
        // 注意：这里使用 land_elevation 进行插值，以在陆地范围内更精确控制
        float alt_transition_a = smoothstep(0.15, 0.3, land_elevation); // 沙滩/低地到中海拔的过渡 (对应图片中绿色开始的海拔)
        color = mix(low_altitude_color, mid_altitude_color, alt_transition_a);

        float alt_transition_b = smoothstep(0.4, 0.6, land_elevation); // 中海拔到高海拔的过渡 (对应图片中灰色岩石开始的海拔)
        color = mix(color, high_altitude_color, alt_transition_b);

        // 雪山：图片中雪线较高，且边界较清晰
        float snow_transition = smoothstep(0.85, 0.95, land_elevation); // 控制雪线的海拔
        color = mix(color, color_snow, snow_transition);
    }


//   gl_FragColor = vec4(vec3(vElevation), uOpacity);
  gl_FragColor = vec4(color, uOpacity);

}