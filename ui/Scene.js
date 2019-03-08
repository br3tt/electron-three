import { html } from '/web_modules/htm--preact.js'
import { useLayoutEffect, useRef } from '/web_modules/preact--hooks.js'
import * as THREE from '/web_modules/three.js'

class ThreeScene {
  constructor() {
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
    })

    this.renderer.setClearColor(0x000000, 0)
    this.renderer.setSize(window.innerWidth, window.innerHeight)

    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      300000
    )

    this.camera.position.x = 2.3
    this.camera.position.y = 2.0
    this.camera.position.z = 0

    this.camera.lookAt(new THREE.Vector3(0, 0, 0))

    this.scene = new THREE.Scene()
    this.scene.add(new THREE.AmbientLight(0xcccccc))

    this.render = this.render.bind(this)
    this.updateForWindowSize = this.updateForWindowSize.bind(this)

    window.addEventListener('resize', this.updateForWindowSize, true)
    window.onorientationchange = this.updateForWindowSize

    this.group = new THREE.Group()
    const geometry = new THREE.BoxGeometry( 1, 1, 1 )
    const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} )
    const cube = new THREE.Mesh( geometry, material )

    this.group.add( cube )

    this.scene.add( this.group )

    this.render()
  }

  render() {
    requestAnimationFrame(this.render)

    this.group.rotation.x += 0.005
    this.group.rotation.y += 0.005

    this.renderer.render(this.scene, this.camera)
  }

  updateForWindowSize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }
}

export function Scene(props) {
  const scene = new ThreeScene()
  const sceneEl = useRef(null)

  useLayoutEffect(() => {
    sceneEl.current.appendChild(
      scene.renderer.domElement
    )
  })

  return html`
    <div>
      <div id="scene" ref=${sceneEl}></div>
    </div>
  `;
}
