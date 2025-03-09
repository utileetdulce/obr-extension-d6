import { useEffect, useRef, useState } from "react"
import DiceBox from "../components/DiceBox"

const defaultConfig = {
  framerate: 1 / 60,
  sounds: true,
  volume: 100,
  color_spotlight: 0xefdfd5,
  shadows: true,
  theme_surface: "green-felt",
  sound_dieMaterial: "plastic",
  theme_customColorset: null,
  theme_colorset: "white", // see available colorsets in https://github.com/3d-dice/dice-box-threejs/blob/main/src/const/colorsets.js
  theme_texture: "", // see available textures in https://github.com/3d-dice/dice-box-threejs/blob/main/src/const/texturelist.js
  theme_material: "plastic", // "none" | "metal" | "wood" | "glass" | "plastic"
  gravity_multiplier: 400,
  light_intensity: 1.7,
  baseScale: 100,
  strength: 1, // toss strength of dice
  onRollComplete: () => {},
}

export const useDiceBox = () => {
  const diceBoxRef = useRef(null)
  const [box, setBox] = useState(null)

  useEffect(() => {
    if (diceBoxRef.current) {
      const DBox = new DiceBox(diceBoxRef, defaultConfig)
      DBox.initialize().then(() => {
        console.log("Box initialized:", DBox)
        setBox(DBox)
      })

      const domElement = diceBoxRef.current

      return () => {
        while (domElement.firstChild) {
          domElement.removeChild(domElement.lastChild)
        }
        setBox(null)
      }
    }
  }, [diceBoxRef.current])

  return { diceBoxRef, box }
}
