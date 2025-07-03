import { Pane } from 'tweakpane'
import { type Biome, params } from './params'

const pane = new Pane({
  title: `Island`,
})

const common = pane.addFolder({
  title: 'common',
})

common.addBinding(params, 'cellSize', {
  min: 2,
  max: 40,
  step: 2,
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
  min: 0,
  max: 1,
  step: 0.01,
})

const biomes = pane.addFolder({
  title: 'biomes',
})
const biomeObj: Record<string, string> = {}

Object.keys(params.biomes).forEach((biome) => {
  biomeObj[biome] = params.biomes[biome as Biome].color

  biomes.addBinding(biomeObj, biome, {
    view: 'color',
  }).on('change', (e) => {
    if (e.last) {
      params.biomes[biome as Biome].color = e.value
    }
  })
})

const noise = pane.addFolder({
  title: 'noise',
})

noise.addBinding(params.noise, 'seed', {
  min: 100,
  max: 100000,
  step: 1,
})
noise.addBinding(params.noise, 'scale', {
  min: 0,
  max: 1,
  step: 0.001,
})
noise.addBinding(params.noise, 'octaves', {
  min: 1,
  max: 12,
  step: 1,
})
noise.addBinding(params.noise, 'persistance', {
  min: 0.1,
  max: 2,
  step: 0.1,
})
noise.addBinding(params.noise, 'lacunarity', {
  min: 0.1,
  max: 8,
  step: 0.1,
})
noise.addBinding(params.noise, 'redistribution', {
  min: 1,
  max: 8,
  step: 1,
})

export default pane
