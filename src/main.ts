import {
  AmbientLight,
  AxesHelper,
  Clock,
  Color,
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
import { type Biome, params, type Params } from './params'
import fbmFragement from './shaders/fbm/main.frag'
import fbmVertex from './shaders/fbm/main.vert'

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
    const seaLevel = this.params.seaLevel
    const biomes = this.params.biomes
    const waterValue = seaLevel
    // const biomeValues = Object.keys(biomes).map((key) => {
    //   return key === 'water' ? waterValue : waterValue + biomes[key as Biome].value
    // })
    // const biomeColors = Object.keys(biomes).map((key) => {
    //   return new Color(biomes[key as Biome].color)
    // })

    const uWaterValue = waterValue
    const uWaterColor = new Color(biomes.water.color)
    const uShoreValue = waterValue + biomes.shore.value
    const uShoreColor = new Color(biomes.shore.color)
    const uBeachValue = waterValue + biomes.beach.value
    const uBeachColor = new Color(biomes.beach.color)
    const uShrubValue = waterValue + biomes.shrub.value
    const uShrubColor = new Color(biomes.shrub.color)
    const uForestValue = waterValue + biomes.forest.value
    const uForestColor = new Color(biomes.forest.color)
    const uStoneValue = waterValue + biomes.stone.value
    const uStoneColor = new Color(biomes.stone.color)
    const uSnowValue = waterValue + biomes.snow.value
    const uSnowColor = new Color(biomes.snow.color)

    console.log(uWaterValue, uShoreValue, uBeachValue, uShrubValue, uForestValue, uStoneValue, uSnowValue)
    console.log(uWaterColor.getHexString(), uShoreColor.getHexString(), uBeachColor.getHexString(), uShrubColor.getHexString(), uForestColor.getHexString(), uStoneColor.getHexString(), uSnowColor.getHexString())
    console.log(uWaterColor)
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
        uSeaLevel: { value: seaLevel },
        uWaterValue: { value: uWaterValue },
        uWaterColor: { value: uWaterColor },
        uShoreValue: { value: uShoreValue },
        uShoreColor: { value: uShoreColor },
        uBeachValue: { value: uBeachValue },
        uBeachColor: { value: uBeachColor },
        uShrubValue: { value: uShrubValue },
        uShrubColor: { value: uShrubColor },
        uForestValue: { value: uForestValue },
        uForestColor: { value: uForestColor },
        uStoneValue: { value: uStoneValue },
        uStoneColor: { value: uStoneColor },
        uSnowValue: { value: uSnowValue },
        uSnowColor: { value: uSnowColor },
        // uBiomeValues: {
        //   value: biomeValues,
        // },
        // uBiomeColors: {
        //   value: biomeColors,
        // },

      },
      vertexShader: fbmVertex,
      fragmentShader: fbmFragement,
      transparent: true,
      side: DoubleSide,
      // wireframe: true,
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
    console.log(params)
    this.group.clear()
    // this.camera.position.set(0, 0, this.params.size)
    if (params.size !== this.params.size) {
      this.camera.position.setZ(this.params.size)
    }
    this.params = params

    this.render()
  }
}

const view = new View('canvas.webgl', params)

pane.on('change', (e) => {
  if (e.last) {
    view.rerender(params)
  }
})
