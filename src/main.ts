import {
  AmbientLight,
  AxesHelper,
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
import { params, type Params } from './params'
import fbmFragement from './shaders/main.frag'
import fbmVertex from './shaders/main.vert'

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
      preserveDrawingBuffer: true,
    })

    this.renderer.setSize(this.width, this.height)
    this.renderer.setPixelRatio(this.pixelRatio)
    this.renderer.setClearColor(0xFFFFFF, 1)

    this.controls = new OrbitControls(this.camera, this.canvas)
    this.controls.enableDamping = true

    this.group = new Group()
    this.scene.add(this.group)

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
    const seaLevel = this.params.seaLevel / 2
    const elevation = this.params.elevation
    const moisture = this.params.moisture
    const blendMode = this.params.blendMode
    const biomes = this.params.biomes
    const {
      OCEAN,
      SHALLOW_OCEAN,
      BEACH,
      TEMPERATE_DESERT,
      SHRUBLAND,
      TAIGA,
      TEMPERATE_DECIDUOUS_FOREST,
      TEMPERATE_RAIN_FOREST,
      SUBTROPICAL_DESERT,
      GRASSLAND,
      TROPICAL_SEASONAL_FOREST,
      TROPICAL_RAIN_FOREST,
      SCORCHED,
      BARE,
      TUNDRA,
      SNOW,
    } = biomes

    const uOceanColor = new Color(OCEAN)
    const uShallowOceanColor = new Color(SHALLOW_OCEAN)
    const uBeachColor = new Color(BEACH)
    const uTemperateDesertColor = new Color(TEMPERATE_DESERT)
    const uShrublandColor = new Color(SHRUBLAND)
    const uTaigaColor = new Color(TAIGA)
    const uTemperateDeciduousForestColor = new Color(TEMPERATE_DECIDUOUS_FOREST)
    const uTemperateRainForestColor = new Color(TEMPERATE_RAIN_FOREST)
    const uSubtropicalDesertColor = new Color(SUBTROPICAL_DESERT)
    const uGrasslandColor = new Color(GRASSLAND)
    const uTropicalSeasonalForestColor = new Color(TROPICAL_SEASONAL_FOREST)
    const uTropicalRainForestColor = new Color(TROPICAL_RAIN_FOREST)
    const uScorchedColor = new Color(SCORCHED)
    const uBareColor = new Color(BARE)
    const uTundraColor = new Color(TUNDRA)
    const uSnowColor = new Color(SNOW)

    const material = new ShaderMaterial({
      uniforms: {
        uSize: { value: size },
        uCellSize: { value: cellSize },
        uOpacity: { value: this.params.opacity },
        uIsIsland: { value: this.params.isIsland },
        uIslandPoint: { value: this.params.island.point },
        uElevationSeed: { value: elevation.seed },
        uElevationScale: { value: elevation.scale },
        uElevationOctaves: { value: elevation.octaves },
        uElevationLacunarity: { value: elevation.lacunarity },
        uElevationPersistance: { value: elevation.persistance },
        uElevationRedistribution: { value: elevation.redistribution },
        uMoistureSeed: { value: moisture.seed },
        uMoistureScale: { value: moisture.scale },
        uMoistureOctaves: { value: moisture.octaves },
        uMoistureLacunarity: { value: moisture.lacunarity },
        uMoisturePersistance: { value: moisture.persistance },
        uMoistureRedistribution: { value: moisture.redistribution },
        uSeaLevel: { value: seaLevel },
        uBlendMode: { value: blendMode },
        uOceanColor: { value: uOceanColor },
        uShallowOceanColor: { value: uShallowOceanColor },
        uBeachColor: { value: uBeachColor },
        uTemperateDesertColor: { value: uTemperateDesertColor },
        uShrublandColor: { value: uShrublandColor },
        uTaigaColor: { value: uTaigaColor },
        uTemperateDeciduousForestColor: { value: uTemperateDeciduousForestColor },
        uTemperateRainForestColor: { value: uTemperateRainForestColor },
        uSubtropicalDesertColor: { value: uSubtropicalDesertColor },
        uGrasslandColor: { value: uGrasslandColor },
        uTropicalSeasonalForestColor: { value: uTropicalSeasonalForestColor },
        uTropicalRainForestColor: { value: uTropicalRainForestColor },
        uScorchedColor: { value: uScorchedColor },
        uBareColor: { value: uBareColor },
        uTundraColor: { value: uTundraColor },
        uSnowColor: { value: uSnowColor },
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
    this.group.clear()
    if (params.size !== this.params.size) {
      this.camera.position.setZ(this.params.size)
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

const view = new View('canvas.webgl', params)

pane.on('change', (e) => {
  if (e.last) {
    view.rerender(params)
  }
})

pane.addButton({ title: 'export' }).on('click', () => {
  view.export()
})
