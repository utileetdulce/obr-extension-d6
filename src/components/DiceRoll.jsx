import { useEffect, useRef } from "react"
import styled from "styled-components"
import DiceBox from "@3d-dice/dice-box-threejs"

const Container = styled.div``

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

// const Box = new DiceBox("#scene-container",{
//   onRollComplete: (results) => {
//     console.log(`I've got results :>> `, results);
//   }
// });

export const DiceRoll = () => {
  const diceBoxRef = useRef(null)

  useEffect(() => {
    new DiceBox(diceBoxRef.current, defaultConfig)
  }, [diceBoxRef])

  return <Container ref={diceBoxRef}>Dice roll</Container>
}
