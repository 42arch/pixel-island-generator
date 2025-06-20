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
  const redistributed = normalized ** redistribution
  return redistributed

  // const redistributed = result ** redistribution
  // return redistributed / max
}

export function fallOff(x: number, y: number, size: number) {
  // const cx = size / 2
  // const cy = size / 2
  // const maxDist = cx
  // const dx = Math.abs(x - cx)
  // const dy = Math.abs(y - cy)
  // const dist = Math.max(dx, dy) / maxDist
  // const gray = Math.floor(dist)
  // return gray
  const n = size
  const i = x
  const j = y
  const maxVal = Math.floor(n / 2)

  const v = Math.floor(
    (n - 1 - Math.min(
      Math.abs(n - 1 - 2 * i),
      Math.abs(n - 1 - 2 * j),
    )) / 2,
  )

  return v / maxVal
}
