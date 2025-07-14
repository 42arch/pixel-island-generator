export type Biome = 'OCEAN' | 'BEACH' | 'TEMPERATE_DESERT' | 'SHRUBLAND' | 'TAIGA' | 'TEMPERATE_DECIDUOUS_FOREST' | 'TEMPERATE_RAIN_FOREST' |
  'SUBTROPICAL_DESERT' | 'GRASSLAND' | 'TROPICAL_SEASONAL_FOREST' | 'TROPICAL_RAIN_FOREST' | 'SCORCHED' | 'BARE' | 'TUNDRA' | 'SNOW'

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
  isIsland: false,
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
  biomes: {
    OCEAN: '#41467b',
    BEACH: '#979087',
    TEMPERATE_DESERT: '#c9d29b',
    SHRUBLAND: '#889978',
    TAIGA: '#99ab77',
    TEMPERATE_DECIDUOUS_FOREST: '#68945a',
    TEMPERATE_RAIN_FOREST: '#448755',
    SUBTROPICAL_DESERT: '#d1b988',
    GRASSLAND: '#88aa56',
    TROPICAL_SEASONAL_FOREST: '#559a45',
    TROPICAL_RAIN_FOREST: '#327754',
    SCORCHED: '#565656',
    BARE: '#888888',
    TUNDRA: '#bbbbab',
    SNOW: '#dddee4',
  },
  elevation: {
    seed: 1685,
    scale: 1,
    octaves: 6,
    persistance: 0.5,
    lacunarity: 2,
    redistribution: 1,
  },
  moisture: {
    seed: 465,
    scale: 1,
    octaves: 6,
    persistance: 0.5,
    lacunarity: 2,
    redistribution: 1,
  },

}
