export type Biome = 'OCEAN' | 'SHALLOW_OCEAN' | 'BEACH' | 'TEMPERATE_DESERT' | 'SHRUBLAND' | 'TAIGA'
  | 'TEMPERATE_DECIDUOUS_FOREST' | 'TEMPERATE_RAIN_FOREST'
  | 'SUBTROPICAL_DESERT' | 'GRASSLAND' | 'TROPICAL_SEASONAL_FOREST'
  | 'TROPICAL_RAIN_FOREST' | 'SCORCHED' | 'BARE' | 'TUNDRA' | 'SNOW'

interface NoiseOptions {
  seed: number
  scale: number
  octaves: number
  lacunarity: number
  persistance: number
  redistribution: number
}

export interface Params {
  size: number
  cellSize: number
  opacity: number
  axes: boolean
  seaLevel: number
  isIsland: boolean
  terrain: {
    speed: number
    direction: 'none' | 'up' | 'down' | 'left' | 'right'
  }
  island: {
    point: {
      x: number
      y: number
    }
  }
  blendMode: boolean
  biomes: {
    [key in Biome]: string
  }
  elevation: NoiseOptions
  moisture: NoiseOptions
}

export const params: Params = {
  size: 1000,
  cellSize: 4,
  opacity: 1,
  axes: false,
  seaLevel: 0.42,
  isIsland: true,
  terrain: {
    speed: 1,
    direction: 'none',
  },
  island: {
    point: {
      x: 0,
      y: 0,
    },
  },
  blendMode: false,
  biomes: {
    OCEAN: '#2a4b7c',
    SHALLOW_OCEAN: '#529ce6',
    BEACH: '#d9c9a3',
    TEMPERATE_DESERT: '#dbcfa2',
    SHRUBLAND: '#a5b68a',
    TAIGA: '#7b9c65',
    TEMPERATE_DECIDUOUS_FOREST: '#5e9b4c',
    TEMPERATE_RAIN_FOREST: '#37754e',
    SUBTROPICAL_DESERT: '#e1c695',
    GRASSLAND: '#9ecb60',
    TROPICAL_SEASONAL_FOREST: '#4a8a3c',
    TROPICAL_RAIN_FOREST: '#256a3a',
    SCORCHED: '#3c3c3c',
    BARE: '#a0a0a0',
    TUNDRA: '#c5c9b3',
    SNOW: '#f2f5f8',
  },
  elevation: {
    seed: 1685,
    scale: 3.0,
    octaves: 6,
    persistance: 0.6,
    lacunarity: 2,
    redistribution: 1,
  },
  moisture: {
    seed: 465,
    scale: 1.2,
    octaves: 3,
    persistance: 0.5,
    lacunarity: 3,
    redistribution: 1,
  },

}
