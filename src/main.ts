import { Camera, Geometry, Mesh, type OGLRenderingContext, Program, Renderer, Transform } from 'ogl'

interface Point {
  x: number
  y: number
}

interface Params {
  gridSize: number
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
    this.generatePoints()
    this.generateCenters()
    console.log('centers', this.points, this.centers)

    this.renderPoints()
  }

  resize() {
    const _resize = () => {
      this.width = this.dom.clientWidth
      this.height = this.dom.clientHeight

      this.renderer.dpr = this.dpr
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
}

const params: Params = {
  gridSize: 10,
}

const viewer = new Viewer(document.getElementById('viewer') as HTMLDivElement, params)
