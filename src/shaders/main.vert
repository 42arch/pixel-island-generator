
#include noise2D.glsl

uniform float uSize;
uniform float uCellSize;
uniform float u_time;
uniform float u_height_scale;
uniform float u_frequency;
uniform int u_octaves;
uniform float u_persistence;
varying float v_height;
varying float v_moisture;
uniform float u_moisture_frequency;
uniform int u_moisture_octaves;
uniform float u_moisture_persistence;


void main() {
  // vUv = uv;
  // vec2 pos = (vUv - 0.5) * uSize;
  // vec2 cell = floor(pos / uCellSize);
  
  // vec2 cellPos = cell / uSize * uCellSize;
  
  // vec2 cellCenter = (cell + 0.5) * uCellSize;

  vec2 position_scaled = position.xy * u_frequency;
  float total_noise = 0.0;
  float amplitude = 1.0;
  float frequency = 1.0;

  for (int i = 0; i < u_octaves; i++) {
    total_noise += snoise(position_scaled * frequency) * amplitude;
    amplitude *= u_persistence;
    frequency *= 2.0; // Double frequency for next octave
  }

  total_noise = (total_noise + 1.0) * 0.5;
  float dist_from_center = length(position.xy);
  float gradient_factor = 1.0 - pow(dist_from_center / 500.0, 2.0); // Adjust 5.0 for island size
  gradient_factor = max(0.0, gradient_factor);
  float final_height = total_noise * gradient_factor;


  // moisture
  vec2 moisture_position_scaled = position.xy * u_moisture_frequency + vec2(100.0, 50.0); // 添加偏移量
  float total_noise_moisture = 0.0;
  float amplitude_moisture = 1.0;
  float frequency_moisture = 1.0;

  for (int i = 0; i < u_moisture_octaves; i++) {
      total_noise_moisture += snoise(moisture_position_scaled * frequency_moisture) * amplitude_moisture;
      amplitude_moisture *= u_moisture_persistence;
      frequency_moisture *= 2.0;
  }
  total_noise_moisture = (total_noise_moisture + 1.0) * 0.5; // 归一化到 [0, 1]
  v_moisture = total_noise_moisture * step(0.35, final_height); // only apply moisture if height > 0.35 (e.g., land threshold)
  v_moisture = clamp(v_moisture, 0.0, 1.0);


  vec3 new_position = position;
  new_position.z += final_height * u_height_scale;

  v_height = final_height;


  gl_Position = projectionMatrix * modelViewMatrix * vec4(new_position, 1.0);
}