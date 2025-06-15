import { Camera, Geometry, Mesh, type OGLRenderingContext, Plane, Program, Renderer, Texture, Transform } from 'ogl'
import { Pane } from 'tweakpane'
import { getElevationColor } from './utils/color'
import { fbm, type NoiseOptions, simplex } from './utils/noise'

interface Point {
  x: number
  y: number
}

interface Params {
  gridSize: number
  noise: NoiseOptions
}

class Viewer {
  private dom: HTMLDivElement
  private params: Params
  private width: number = 0
  private height: number = 0
  private dpr: number = Math.min(window.devicePixelRatio, 2)
  private renderer: Renderer
  private gl: OGLRenderingContext
  private camera: Camera
  private scene: Transform

  private points: Point[] = []
  private centers: Point[] = []

  constructor(dom: HTMLDivElement, params: Params) {
    this.dom = dom
    this.params = params
    this.renderer = new Renderer({
      antialias: true,
    })
    this.gl = this.renderer.gl
    this.gl.clearColor(0, 0, 0, 1)
    this.camera = new Camera(this.gl, {
      near: 0.1,
      far: 1000,
    })
    this.camera.position.z = 3
    this.camera.lookAt([0, 0, 0])

    this.dom.appendChild(this.gl.canvas)
    this.scene = new Transform()

    this.resize()
    this.update()
    // this.generatePoints()
    // this.generateCenters()
    console.log('centers', this.points, this.centers)

    this.render()
    // this.renderPoints()
    // this.generateTexture()
  }

  resize() {
    const _resize = () => {
      this.width = this.dom.clientWidth
      this.height = this.dom.clientHeight

      this.renderer.dpr = this.dpr

      console.log('width', this.width, this.height, this.dpr)

      this.renderer.setSize(this.width, this.height)

      this.camera.orthographic({
        left: 0,
        right: this.width,
        top: this.height,
        bottom: 0,
      })
    }
    this.dom.addEventListener('resize', _resize, false)
    _resize()
  }

  update() {
    const _update = (t: number) => {
      requestAnimationFrame(_update)
      this.renderer.render({ scene: this.scene, camera: this.camera })
    }
    requestAnimationFrame(_update)
  }

  generatePoints() {
    for (let x = 0; x < this.width; x += this.params.gridSize) {
      for (let y = 0; y < this.height; y += this.params.gridSize) {
        this.points.push({ x, y })
      }
    }
  }

  generateCenters() {
    for (let x = this.params.gridSize / 2; x < this.width; x += this.params.gridSize) {
      for (let y = this.params.gridSize / 2; y < this.height; y += this.params.gridSize) {
        this.centers.push({ x, y })
      }
    }
  }

  renderGrid() {
    const gl = this.gl

    const cellSize = this.params.gridSize
    const cols = Math.floor(this.width / this.params.gridSize)
    const rows = Math.floor(this.height / this.params.gridSize)

    const positions = []
    const colors = []
    const uvs = []
    const indices = []
    const elevations: number[] = []

    for (let x = 0; x <= cols; x++) {
      for (let y = 0; y <= rows; y++) {
        const px = x * cellSize
        const py = y * cellSize

        const u = x / cols
        const v = y / rows

        const heightValue = fbm(u, v, {
          seed: this.params.noise.seed,
          scale: this.params.noise.scale,
          persistance: this.params.noise.persistance,
          lacunarity: this.params.noise.lacunarity,
          octaves: this.params.noise.octaves,
          redistribution: this.params.noise.redistribution,
        })

        // elevations.push(heightValue)

        positions.push(px, py, 0)
        const color = getElevationColor(heightValue, 0.48)
        colors.push(color[0], color[1], color[2], color[3])
        // colors.push(heightValue, heightValue, heightValue, 1.0)
        uvs.push(u, v)
      }
    }

    console.log('elevations', positions.length)

    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        const i = y * (cols + 1) + x

        const a = i
        const b = i + 1
        const c = i + cols + 1
        const d = i + cols + 2

        indices.push(a, c, b)
        indices.push(b, c, d)
      }
    }

    const geometry = new Geometry(gl, {
      position: { size: 3, data: new Float32Array(positions) },
      uv: { size: 2, data: new Float32Array(uvs) },
      color: { size: 4, data: new Float32Array(colors) },
      index: { data: new Uint16Array(indices) },
    })

    const program = new Program(gl, {
      vertex: /* glsl */`
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        attribute vec3 position;
        attribute vec2 uv;
        attribute vec4 color;
        varying vec2 vUv;
        varying vec4 vColor;
        void main() {
          vUv = uv;
          vColor = color;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: /* glsl */`
        precision highp float;
        varying vec2 vUv;
        varying vec4 vColor;
        void main() {
          gl_FragColor = vColor;
        }
      `,
    })

    const mesh = new Mesh(gl, { geometry, program })
    mesh.setParent(this.scene)
  }

  renderPoints() {
    const gl = this.gl
    const geometry = new Geometry(gl, {
      position: {
        size: 3,
        data: new Float32Array(
          this.centers.reduce(
            (acc, point) => [...acc, point.x, point.y, 0],
            [] as number[],
          ),
        ),
      },
    })
    const program = new Program(gl, {
      vertex: `
        attribute vec3 position;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;

        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = 2.0;
        }
      `,
      fragment: `
        precision highp float;
        
        void main() {
          gl_FragColor = vec4(0.141, 0.882, 0.463, 0.8);
        }
      `,
      transparent: true,
    })

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    const points = new Mesh(gl, { mode: gl.POINTS, geometry, program })
    points.setParent(this.scene)
  }

  render() {
    const gl = this.gl
    this.renderGrid()
  }

  rerender(params: Params) {
    this.params = params
    this.scene = new Transform()
    this.render()
  }
}

const params: Params = {
  gridSize: 3,
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

pane.addBinding(params, 'gridSize', {
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
  min: 0,
  max: 10,
  step: 0.1,
})

noise.addBinding(params.noise, 'octaves', {
  min: 0,
  max: 10,
  step: 1,
})
