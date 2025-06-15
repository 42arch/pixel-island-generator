import type { OrbitControls } from 'three/examples/jsm/Addons.js'
import { Float32BufferAttribute, Group, Mesh, MeshBasicMaterial, PerspectiveCamera, PlaneGeometry, Scene, WebGLRenderer } from 'three'
import { Pane } from 'tweakpane'
import { getElevationColor } from './utils/color'
import { fbm, type NoiseOptions, simplex } from './utils/noise'

interface Point {
  x: number
  y: number
}

interface Params {
  cellSize: number
  noise: NoiseOptions
}

class Viewer {
  private dom: HTMLDivElement
  private params: Params
  private width: number = 0
  private height: number = 0
  private dpr: number = Math.min(window.devicePixelRatio, 2)
  private renderer: WebGLRenderer
  private controls: OrbitControls
  private camera: PerspectiveCamera
  private scene: Scene

  private grid?: Mesh

  private points: Point[] = []
  private centers: Point[] = []

  constructor(dom: HTMLDivElement, params: Params) {
    this.dom = dom
    this.params = params
    this.renderer = new WebGLRenderer({
      antialias: true,
    })
    this.camera = new PerspectiveCamera(50, this.width / this.height, 0.1, 1000)
    this.camera.position.z = 110

    this.dom.appendChild(this.renderer.domElement)
    this.scene = new Scene()
    this.scene.add(this.camera)

    // this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    // this.controls.enableDamping = true

    this.resize()
    this.update()
    this.render()
  }

  resize() {
    const _resize = () => {
      this.width = this.dom.clientWidth
      this.height = this.dom.clientHeight

      this.camera.aspect = this.width / this.height
      this.camera.updateProjectionMatrix()

      this.renderer.setSize(this.width, this.height)
      this.renderer.setPixelRatio(this.dpr)
    }
    this.dom.addEventListener('resize', _resize, false)
    _resize()
  }

  update() {
    const _update = (t: number) => {
      requestAnimationFrame(_update)
      this.renderer.render(this.scene, this.camera)
    }
    requestAnimationFrame(_update)
  }

  generateElevations() {
    if (!this.grid)
      return
    const vertices = this.grid.geometry.attributes.position
    const colors = []
    const elevations = []
    const width = 100
    const height = 100

    for (let i = 0; i < vertices.count; i++) {
      const x = vertices.getX(i)
      const y = vertices.getY(i)
      // 归一化到 0~1
      const u = (x + width / 2) / width
      const v = (y + height / 2) / height

      const elevation = fbm(u, v, {
        seed: this.params.noise.seed,
        scale: this.params.noise.scale,
        persistance: this.params.noise.persistance,
        lacunarity: this.params.noise.lacunarity,
        octaves: this.params.noise.octaves,
        redistribution: this.params.noise.redistribution,
      })
      elevations.push(elevation)
      vertices.setZ(i, 0)
      const color = getElevationColor(elevation, 0.48)
      colors.push(color[0], color[1], color[2])
      // colors.push(elevation, elevation, elevation)
      // const color = getColorFromBands(normalizedHeight, colorBands)
      // colors.push(color.r, color.g, color.b)
    }
    vertices.needsUpdate = true
    this.grid.geometry.setAttribute(
      'color',
      new Float32BufferAttribute(colors, 3),
    )
    this.grid.geometry.attributes.color.needsUpdate = true
  }

  renderGrid() {
    const geometry = new PlaneGeometry(100, 100, 200, 200)
    const material = new MeshBasicMaterial({ color: 0xFFFFFF, vertexColors: true, wireframe: false })
    this.grid = new Mesh(geometry, material)
    this.scene.add(this.grid)
  }

  render() {
    // this.renderGrid()
    this.renderGrid()
    this.generateElevations()
  }

  rerender(params: Params) {
    this.params = params
    console.log('rerender', params)
    this.render()
  }
}

const params: Params = {
  cellSize: 3,
  noise: {
    seed: 1989,
    scale: 1,
    persistance: 0.5,
    lacunarity: 2,
    octaves: 6,
    redistribution: 1,
  },
}

const viewer = new Viewer(document.getElementById('viewer') as HTMLDivElement, params)

const pane = new Pane({
  title: 'ISLAND',
})

pane.addBinding(params, 'cellSize', {
  min: 2,
  max: 100,
  step: 10,
}).on('change', (e) => {
  if (e.last)
    viewer.rerender(params)
})

const noise = pane.addFolder({
  title: 'noise',
}).on('change', (e) => {
  if (e.last)
    viewer.rerender(params)
})

noise.addBinding(params.noise, 'seed', {
  min: 0,
  max: 4000,
  step: 1,
})

noise.addBinding(params.noise, 'scale', {
  min: 0,
  max: 10,
  step: 0.1,
})

noise.addBinding(params.noise, 'persistance', {
  min: 0,
  max: 1,
  step: 0.01,
})

noise.addBinding(params.noise, 'lacunarity', {
  min: 1,
  max: 5,
  step: 0.01,
})

noise.addBinding(params.noise, 'octaves', {
  min: 0,
  max: 10,
  step: 1,
})
