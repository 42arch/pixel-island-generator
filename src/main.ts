import {
  AmbientLight,
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
import pane from './gui'
import { params, type Params } from './params'
import fbmFragement from './shaders/main.frag'
import fbmVertex from './shaders/main.vert'
import { getParamsFromUrl, mergeParams, setParamsInUrl } from './url'

class View {
  private width: number
  private height: number
  private pixelRatio: number
  private canvas: HTMLElement
  private scene: Scene
  private camera: PerspectiveCamera
  private renderer: WebGLRenderer
  private controls: OrbitControls
  private group: Group
  private params: Params
  private material: ShaderMaterial | null

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
    this.camera.position.set(0, 0, this.params.size * 0.75)
    this.scene.add(this.camera)
    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      preserveDrawingBuffer: true,
    })

    this.renderer.setSize(this.width, this.height)
    this.renderer.setPixelRatio(this.pixelRatio)
    this.renderer.setClearColor(0xFFFFFF, 1)

    this.controls = new OrbitControls(this.camera, this.canvas)
    this.controls.enableDamping = true

    this.group = new Group()
    this.scene.add(this.group)

    this.material = null
    this.resize()
    // this.addLight()
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
    // const delta = this.clock.getDelta()

    this.renderer.render(this.scene, this.camera)
    this.controls.update()
    if (this.material) {
      this.material.uniforms.uTime.value += 0.01
    }
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

  createFbmMaterial() {
    const size = this.params.size
    const cellSize = this.params.cellSize
    const elevation = this.params.elevation
    const moisture = this.params.moisture

    const material = new ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: size },
        uCellSize: { value: cellSize },
        uAnimateDirection: { value: this.params.island.animate_direction },
        uPixelate: { value: this.params.pixelate },
        uOpacity: { value: this.params.opacity },
        uStyle: { value: this.params.style },
        uShape: { value: this.params.island.shape },
        uSizeExponent: { value: this.params.island.size_exponent },
        uIslandPoint: { value: this.params.island.point },
        uElevationSeed: { value: elevation.seed },
        uElevationScale: { value: elevation.scale },
        uElevationOctaves: { value: elevation.octaves },
        uElevationLacunarity: { value: elevation.lacunarity },
        uElevationPersistance: { value: elevation.persistance },
        uMoistureSeed: { value: moisture.seed },
        uMoistureScale: { value: moisture.scale },
        uMoistureOctaves: { value: moisture.octaves },
        uMoistureLacunarity: { value: moisture.lacunarity },
        uMoisturePersistance: { value: moisture.persistance },
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

    const geometry = new PlaneGeometry(
      size,
      size,
      size,
      size,
    )
    const material = this.createFbmMaterial()
    this.material = material
    const mesh = new Mesh(geometry, material)
    this.group.add(mesh)
  }

  render() {
    this.addGrid()
  }

  rerender(params: Params) {
    this.group.clear()
    if (params.size !== this.params.size) {
      this.camera.position.setZ(this.params.size * 0.75)
    }
    this.params = params

    this.render()
  }

  export() {
    const canvas = this.renderer.domElement
    const dataURL = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = dataURL
    link.download = 'island.png'
    link.click()
  }
}

const fromUrl = getParamsFromUrl()
if (fromUrl) {
  mergeParams(params, fromUrl)
}

const view = new View('canvas.webgl', params)

pane.on('change', (e) => {
  if (e.last) {
    view.rerender(params)
    setParamsInUrl(params)
  }
})

pane.addButton({ title: 'Export' }).on('click', () => {
  view.export()
})

pane.addButton({ title: 'Share' }).on('click', () => {
  setParamsInUrl(params)
  const url = new URL(window.location.href)
  void navigator.clipboard.writeText(url.href).then(() => {
    console.log('Text copied to clipboard')
  })
})

// mixpanel.init('c3fea8462457eeab84bf04985ab48a42', {
//   debug: true,
//   autocapture: true,
//   track_pageview: true,
//   persistence: 'localStorage',
// })
