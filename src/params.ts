interface NoiseOptions {
  seed: number
  scale: number
  octaves: number
  lacunarity: number
  persistance: number
  // redistribution: number
}

export interface Params {
  size: number
  cellSize: number
  pixelate: boolean
  opacity: number
  island: {
    shape: 1 | 2 | 3, // 'circle' | 'square' | 'diamond'
    size_exponent: number,
    animate_direction: 1 | 2 | 3 | 4 | 5, // 'none' | 'top' | 'down' | 'left' | 'right'
    point: {
      x: number
      y: number
    }
  }
  style: 1 | 2 | 3, // 'natural1' | 'natural2' | 'natural-dark'

  elevation: NoiseOptions
  moisture: NoiseOptions
}

export const params: Params = {
  size: 1000,
  cellSize: 2,
  pixelate: false,
  opacity: 1,
  island: {
    shape: 1,
    size_exponent: 2,
    animate_direction: 1,
    point: {
      x: 0,
      y: 0,
    },
  },
  style: 1,
  elevation: {
    seed: getRandomNumber(1, 100000),
    scale: 3.0,
    octaves: 6,
    persistance: 0.6,
    lacunarity: 2,
  },
  moisture: {
    seed: getRandomNumber(1, 100000),
    scale: 1.2,
    octaves: 3,
    persistance: 0.5,
    lacunarity: 3,
  },
}


export function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
