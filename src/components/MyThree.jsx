import * as THREE from "three"
import DiceBox from "@3d-dice/dice-box-threejs"

import { useEffect, useRef } from "react"

const defaultConfig = {
  framerate: 1 / 60,
  sounds: false,
  volume: 100,
  color_spotlight: 0xefdfd5,
  shadows: true,
  theme_surface: "green-felt",
  sound_dieMaterial: "plastic",
  theme_customColorset: null,
  theme_colorset: "white", // see available colorsets in https://github.com/3d-dice/dice-box-threejs/blob/main/src/const/colorsets.js
  theme_texture: "", // see available textures in https://github.com/3d-dice/dice-box-threejs/blob/main/src/const/texturelist.js
  theme_material: "glass", // "none" | "metal" | "wood" | "glass" | "plastic"
  gravity_multiplier: 400,
  light_intensity: 0.7,
  baseScale: 100,
  strength: 1, // toss strength of dice
  onRollComplete: () => {},
}

let Box
let renderer

function MyThree() {
  const refContainer = useRef(null)
  useEffect(() => {
    // === THREE.JS CODE START ===
    var scene = new THREE.Scene()
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    // document.body.appendChild( renderer.domElement );
    // use ref as a mount point of the Three.js scene instead of the document.body
    refContainer.current && refContainer.current.appendChild(renderer.domElement)
    var geometry = new THREE.BoxGeometry(1, 1, 1)
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    var cube = new THREE.Mesh(geometry, material)
    scene.add(cube)
    camera.position.z = 5
    var animate = function () {
      requestAnimationFrame(animate)
      cube.rotation.x += 0.01
      cube.rotation.y += 0.01
      renderer.render(scene, camera)
    }
    animate()
  }, [])
  return (
    <div id={"kalle"} ref={refContainer}>
      <button
        onClick={() => {
          Box = new DiceBox("#kalle", defaultConfig)
          console.log("Box:", Box)
          Box.renderer = renderer
          Box.roll("6d6")
        }}
      >
        roll
      </button>
    </div>
  )
}

export default MyThree
