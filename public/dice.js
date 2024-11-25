// const DiceBox = require("@3d-dice/dice-box-threejs")
const DiceBox = require("@3d-dice/dice-box-threejs")

console.log("Hello, world!")
const Box = new DiceBox("#scene-container", {
  onRollComplete: (results) => {
    console.log(`I've got results :>> `, results)
  },
})
