import alea from 'alea'
import { createNoise2D } from 'simplex-noise'

export interface NoiseOptions {
  seed: number
  scale?: number
  persistance?: number
  lacunarity?: number
  octaves?: number
  redistribution?: number
}

export function simplex(x: number, y: number, options: NoiseOptions) {
  const {
    seed,
  } = options

  const prng = alea(seed)
  const noise = createNoise2D(prng)
  return noise(x, y)
}

export function fbm(x: number, y: number, options: NoiseOptions) {
  const {
    seed,
    scale = 1,
    persistance = 0.5,
    lacunarity = 2,
    octaves = 6,
    redistribution = 1,
  } = options

  const prng = alea(seed)
  const noise = createNoise2D(prng)

  let result = 0
  let amplitude = 1
  let frequency = 1
  let max = amplitude

  for (let i = 0; i < octaves; i++) {
    const nx = x * scale * frequency
    const ny = y * scale * frequency
    const noiseValue = noise(nx, ny)

    // result += (noiseValue * 0.5 + 0.5) * amplitude
    result += (noiseValue) * amplitude

    frequency *= lacunarity
    amplitude *= persistance
    max += amplitude
  }

  const normalized = (result / max) * 0.5 + 0.5
  // const redistributed = normalized ** redistribution
  // return redistributed / max

  const redistributed = normalized ** redistribution
  return redistributed
}
