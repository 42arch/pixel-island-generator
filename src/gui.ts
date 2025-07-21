import { Pane } from 'tweakpane'
import { type Biome, params } from './params'

const pane = new Pane({
  title: `Island`,
})

const common = pane.addFolder({
  title: 'common',
})

common.addBinding(params, 'cellSize', {
  min: 1,
  max: 40,
  step: 1,
})
common.addBinding(params, 'size', {
  min: 80,
  max: 1000,
  step: 20,
})
common.addBinding(params, 'opacity', {
  min: 0,
  max: 1,
  step: 0.01,
})
common.addBinding(params, 'axes')
common.addBinding(params, 'seaLevel', {
  min: 0.01,
  max: 1.0,
  step: 0.01,
})

pane.addBlade({
  view: 'separator',
})

const terrain = pane.addFolder({
  title: 'terrain',
  expanded: false,
})
terrain.addBinding(params.terrain, 'speed', {
  min: 0,
  max: 1,
  step: 0.01,
})

terrain.addBlade({
  view: 'list',
  label: 'direction',
  options: [
    { text: 'none', value: 'none' },
    { text: 'top', value: 'top' },
    { text: 'bottom', value: 'bottom' },
    { text: 'left', value: 'left' },
    { text: 'right', value: 'right' },
  ],
  value: params.terrain.direction,
})

const island = pane.addFolder({
  title: 'island',
  expanded: false,
})

island.addBinding(params.island, 'point', {
  x: {
    min: -params.size / 2,
    max: params.size / 2,
    revert: true,
  },
  y: {
    min: -params.size / 2,
    max: params.size / 2,
    revert: true,
  },
})

if (params.isIsland) {
  island.hidden = false
  terrain.hidden = true
}
else {
  island.hidden = true
  terrain.hidden = false
}

common.addBinding(params, 'isIsland').on('change', (e) => {
  if (e.last) {
    if (params.isIsland) {
      island.hidden = false
      terrain.hidden = true
    }
    else {
      island.hidden = true
      terrain.hidden = false
    }
  }
})

pane.addBlade({
  view: 'separator',
})

const biomes = pane.addFolder({
  title: 'biomes',
  expanded: false,
})
const biomeObj: Record<string, string> = {}

Object.keys(params.biomes).forEach((biome) => {
  biomeObj[biome] = params.biomes[biome as Biome]

  biomes.addBinding(biomeObj, biome, {
    view: 'color',
  }).on('change', (e) => {
    if (e.last) {
      params.biomes[biome as Biome] = e.value
    }
  })
})

pane.addBlade({
  view: 'separator',
})

const elevation = pane.addFolder({
  title: 'elevation',
  expanded: false,
})

elevation.addBinding(params.elevation, 'seed', {
  min: 1,
  max: 100000,
  step: 1,
})
elevation.addBinding(params.elevation, 'scale', {
  min: 0.1,
  max: 10,
  step: 0.001,
})
elevation.addBinding(params.elevation, 'octaves', {
  min: 1,
  max: 12,
  step: 1,
})
elevation.addBinding(params.elevation, 'persistance', {
  min: 0.1,
  max: 2,
  step: 0.1,
})
elevation.addBinding(params.elevation, 'lacunarity', {
  min: 0.1,
  max: 8,
  step: 0.1,
})
elevation.addBinding(params.elevation, 'redistribution', {
  min: 0.1,
  max: 4,
  step: 0.1,
})

pane.addBlade({
  view: 'separator',
})
const moisture = pane.addFolder({
  title: 'moisture',
  expanded: false,
})
moisture.addBinding(params.moisture, 'seed', {
  min: 1,
  max: 100000,
  step: 1,
})
moisture.addBinding(params.moisture, 'scale', {
  min: 0.1,
  max: 10,
  step: 0.001,
})
moisture.addBinding(params.moisture, 'octaves', {
  min: 1,
  max: 12,
  step: 1,
})
moisture.addBinding(params.moisture, 'persistance', {
  min: 0.1,
  max: 2,
  step: 0.1,
})
moisture.addBinding(params.moisture, 'lacunarity', {
  min: 0.1,
  max: 8,
  step: 0.1,
})
moisture.addBinding(params.moisture, 'redistribution', {
  min: 0.1,
  max: 4,
  step: 0.1,
})

pane.addButton({
  title: 'generate',
}).on('click', () => {
})

export default pane
