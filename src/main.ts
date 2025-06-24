/* eslint-disable ts/no-unsafe-assignment */
import {
  AmbientLight,
  AxesHelper,
  Clock,
  DirectionalLight,
  DoubleSide,
  Group,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { Pane } from 'tweakpane'
import fbmFragement from './shaders/fbm/main.frag'
import fbmVertex from './shaders/fbm/main.vert'

interface Params {
  size: number
  cellSize: number
  opacity: number
  axes: boolean
  noise: {
    seed: number
    scale: number
    octaves: number
    lacunarity: number
    persistance: number
    redistribution: number
  }
}

class View {
  private width: number
  private height: number
  private pixelRatio: number
  private canvas: HTMLElement
  private scene: Scene
  private camera: PerspectiveCamera
  private renderer: WebGLRenderer
  private controls: OrbitControls
  private clock: Clock
  private group: Group
  private params: Params

  constructor(element: string, params: Params) {
    this.canvas = document.querySelector(element) as HTMLElement
    this.params = params
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.pixelRatio = Math.min(window.devicePixelRatio, 2)
    this.scene = new Scene()
    this.camera = new PerspectiveCamera(
      75,
      this.width / this.height,
      0.001,
      10000,
    )
    this.camera.position.set(0, 0, this.params.size)
    this.scene.add(this.camera)
    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    })

    this.renderer.setSize(this.width, this.height)
    this.renderer.setPixelRatio(this.pixelRatio)

    this.controls = new OrbitControls(this.camera, this.canvas)
    this.controls.enableDamping = true
    this.clock = new Clock()

    this.group = new Group()
    this.scene.add(this.group)

    this.resize()
    this.addLight()
    this.render()
    this.animate()
  }

  resize() {
    window.addEventListener('resize', () => {
      this.width = window.innerWidth
      this.height = window.innerHeight

      this.camera.aspect = this.width / this.height
      this.camera.updateProjectionMatrix()

      this.renderer.setSize(this.width, this.height)
      this.renderer.setPixelRatio(this.pixelRatio)
    })
  }

  animate() {
    const delta = this.clock.getDelta()

    this.renderer.render(this.scene, this.camera)
    this.controls.update()
    window.requestAnimationFrame(this.animate.bind(this))
  }

  addLight() {
    const ambientLight = new AmbientLight(0xFFFFFF, 4)
    this.scene.add(ambientLight)

    const directionalLight = new DirectionalLight(0xFFFFFF, Math.PI)
    directionalLight.position.set(4, 0, 2)
    directionalLight.castShadow = true
    this.scene.add(directionalLight)
  }

  addHelper() {
    const helper = new AxesHelper((this.params.size * 2) / 3)
    this.group.add(helper)
  }

  createFbmMaterial() {
    const size = this.params.size
    const cellSize = this.params.cellSize
    const material = new ShaderMaterial({
      uniforms: {
        uSize: { value: size },
        uCellSize: { value: cellSize },
        uOpacity: { value: this.params.opacity },
        uSeed: { value: this.params.noise.seed },
        uScale: { value: this.params.noise.scale },
        uOctaves: { value: this.params.noise.octaves },
        uLacunarity: { value: this.params.noise.lacunarity },
        uPersistance: { value: this.params.noise.persistance },
        uRedistribution: { value: this.params.noise.redistribution },
      },
      vertexShader: fbmVertex,
      fragmentShader: fbmFragement,
      transparent: true,
      side: DoubleSide,
    })
    return material
  }

  addGrid() {
    const size = this.params.size
    const cellSize = this.params.cellSize

    const geometry = new PlaneGeometry(
      size,
      size,
      size / cellSize,
      size / cellSize,
    )
    const material = this.createFbmMaterial()
    const mesh = new Mesh(geometry, material)

    this.group.add(mesh)
  }

  render() {
    if (this.params.axes) {
      this.addHelper()
    }
    this.addGrid()
  }

  rerender(params: Params) {
    this.params = params
    this.group.clear()
    this.camera.position.set(0, 0, this.params.size)
    this.render()
  }
}

const params: Params = {
  size: 1000,
  cellSize: 10,
  opacity: 0.5,
  axes: false,
  noise: {
    seed: 1,
    scale: 0.01,
    octaves: 6,
    persistance: 0.5,
    lacunarity: 2,
    redistribution: 1,
  },
}

const view = new View('canvas.webgl', params)

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

const noise = pane.addFolder({
  title: 'noise',
})

noise.addBinding(params.noise, 'seed', {
  min: 0,
  max: 100,
  step: 1,
})
noise.addBinding(params.noise, 'scale', {
  min: 0,
  max: 0.1,
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

pane.on('change', (e) => {
  if (e.last) {
    view.rerender(params)
  }
})
