import { Color } from 'ogl'

export function getElevationColor(
  elevation: number,
  seaLevel: number,
): [number, number, number, number] {
  const colors = {
    snow: {
      value: 0.6,
      color: '#9aa7ad',
    },
    stone: {
      value: 0.36,
      color: '#656565',
    },
    forest: {
      value: 0.29,
      color: '#586647',
    },
    shrub: {
      value: 0.1,
      color: '#9ea667',
    },
    beach: {
      value: 0.04,
      color: '#efb28f',
    },
    shore: {
      value: 0.01,
      color: '#ffd68f',
    },
    water: {
      value: 0.12,
      color: '#00a9ff',
    },
  }

  let color

  if (elevation < seaLevel) {
    color = new Color(colors.water.color)
  }
  else if (elevation < seaLevel + colors.shore.value) {
    color = new Color(colors.shore.color)
  }
  else if (elevation < seaLevel + colors.beach.value) {
    color = new Color(colors.beach.color)
  }
  else if (elevation < seaLevel + colors.shrub.value) {
    color = new Color(colors.shrub.color)
  }
  else if (elevation < seaLevel + colors.forest.value) {
    color = new Color(colors.forest.color)
  }
  else if (elevation < seaLevel + colors.stone.value) {
    color = new Color(colors.stone.color)
  }
  else {
    color = new Color(colors.snow.color)
  }

  return [color.r, color.g, color.b, 0.95]
}
