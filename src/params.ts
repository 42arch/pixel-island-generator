export type Biome = 'snow' | 'stone' | 'forest' | 'shrub' | 'beach' | 'shore' | 'water'

export interface Params {
  size: number
  cellSize: number
  opacity: number
  axes: boolean
  seaLevel: number
  biomes: {
    [key in Biome]: {
      value: number
      color: string
    }
  }
  noise: {
    seed: number
    scale: number
    octaves: number
    lacunarity: number
    persistance: number
    redistribution: number
  }
}

export const params: Params = {
  size: 1000,
  cellSize: 4,
  opacity: 1,
  axes: false,
  seaLevel: 0.42,
  biomes: {
    snow: {
      value: 0.65,
      color: '#9aa7ad',
    },
    stone: {
      value: 0.46,
      color: '#656565',
    },
    forest: {
      value: 0.32,
      color: '#586647',
    },
    shrub: {
      value: 0.12,
      color: '#9ea667',
    },
    beach: {
      value: 0.06,
      color: '#efb28f',
    },
    shore: {
      value: 0.01,
      color: '#ffd68f',
    },
    water: {
      value: 0.42,
      color: '#00a9ff',
    },
  },
  noise: {
    seed: 1685,
    scale: 0.21,
    octaves: 6,
    persistance: 0.5,
    lacunarity: 2,
    redistribution: 1,
  },
}
