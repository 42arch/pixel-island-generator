import { Pane } from 'tweakpane'
import * as InfodumpPlugin from 'tweakpane-plugin-infodump'
import { getRandomNumber, params } from './params'

const pane = new Pane({ title: `Parameters` })
pane.registerPlugin(InfodumpPlugin)

const general = pane.addFolder({ title: 'General' })
general.addBinding(params, 'cellSize', {
  label: 'cell size',
  min: 1,
  max: 12,
  step: 1,
})
general.addBinding(params, 'size', {
  min: 100,
  max: 1000,
  step: 10,
})
general.addBinding(params, 'pixelate')

general.addBinding(params, 'opacity', {
  min: 0,
  max: 1,
  step: 0.01,
})

general.addBinding(params, 'style', {
  view: 'list',
  options: [
    { text: 'natural 1', value: 1 },
    { text: 'natural 2', value: 2 },
    { text: 'natural dark', value: 3 },
  ],
})

const island = pane.addFolder({
  title: 'Island',
  expanded: true,
})

island.addBinding(params.island, 'shape', {
  view: 'list',
  options: [
    { text: 'circle', value: 1 },
    { text: 'square', value: 2 },
    { text: 'diamond', value: 3 },
  ],
})

island.addBinding(params.island, 'size_exponent', {
  label: 'size exponent',
  min: 0,
  max: 10,
  step: 0.01,
})
island.addBinding(params.island, 'animate_direction', {
  label: 'animate direction',
  view: 'list',
  options: [
    { text: 'none', value: 1 },
    { text: 'top', value: 2 },
    { text: 'down', value: 3 },
    { text: 'left', value: 4 },
    { text: 'right', value: 5 },
  ],
})

pane.addBlade({ view: 'separator' })

const elevation = pane.addFolder({
  title: 'Elevation',
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
  max: 1.2,
  step: 0.01,
})
elevation.addBinding(params.elevation, 'lacunarity', {
  min: 0.1,
  max: 8,
  step: 0.01,
})
// elevation.addBinding(params.elevation, 'redistribution', {
//   min: 0.1,
//   max: 4,
//   step: 0.1,
// })

pane.addBlade({ view: 'separator' })
const moisture = pane.addFolder({
  title: 'Moisture',
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
  step: 0.01,
})
moisture.addBinding(params.moisture, 'lacunarity', {
  min: 0.1,
  max: 8,
  step: 0.01,
})
// moisture.addBinding(params.moisture, 'redistribution', {
//   min: 0.1,
//   max: 4,
//   step: 0.1,
// })
pane.addBlade({ view: 'separator' })

const info = pane.addFolder({ title: 'Info', expanded: false })
info.addBlade({
  view: 'infodump',
  // eslint-disable-next-line style/max-len
  content: `Procedural Island Generator is a WebGL-powered tool that creates random islands or terrains using Perlin noise and Fractional Brownian Motion.
  You can find the [Source Code](https://github.com/42arch/procedural-island-generator) on GitHub.
  `,
  markdown: true,
})
pane.addBlade({ view: 'separator' })

pane.addButton({ title: 'Generate' }).on('click', () => {
  params.elevation.seed = getRandomNumber(1, 100000)
  params.moisture.seed = getRandomNumber(1, 100000)
  pane.refresh()
})

export default pane
