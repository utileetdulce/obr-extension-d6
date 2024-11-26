import { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import DiceBox from "@3d-dice/dice-box-threejs"

const Container = styled.div`
  height: 500px;
  width: 500px;
  background-color: red;
`

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
  theme_material: "glass", // "none" | "metal" | "wood" | "glass" | "plastic"
  gravity_multiplier: 400,
  light_intensity: 0.7,
  baseScale: 100,
  strength: 1, // toss strength of dice
  onRollComplete: () => {},
}

// const Box = new DiceBox("#scene-container",{
//   onRollComplete: (results) => {
//     console.log(`I've got results :>> `, results);
//   }
// });

export const DiceRoll = () => {
  const diceBoxRef = useRef(null)
  const [box, setBox] = useState(null)

  useEffect(() => {
    const DBox = new DiceBox("#asdf", defaultConfig)
    DBox.initialize().then(() => {
      console.log("DBox initialized:", DBox)
      setBox(DBox)
    })

    return () => {
      try {
        document.body.removeChild(DBox.renderer.domElement)
      } catch (e) {
        console.log("error:", e)
      }
    }
  }, [diceBoxRef])

  return (
    <>
      <button
        onClick={() => {
          box.roll("6d6@6,6,6,6,6,6")
        }}
      >
        add(
      </button>
      <Container id={"asdf"} ref={diceBoxRef}></Container>
    </>
  )
}
