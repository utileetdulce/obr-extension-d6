import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./components/App.jsx"
import { GlobalStyles } from "./components/GlobalStyles.jsx"
import OBR from "@owlbear-rodeo/sdk"
import { mockObr } from "./obrMock.js"
import DiceBox from "@3d-dice/dice-box-threejs"
import "./styles.css"

if (!OBR.isAvailable) {
  mockObr()
}

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <App />
//     <GlobalStyles />
//   </StrictMode>,
// )

// set configurations when invoking the class
const Box = new DiceBox("#root", {
  theme_customColorset: {
    // background: [
    //   "#00ffcb",
    //   "#ff6600",
    //   "#1d66af",
    //   "#7028ed",
    //   "#c4c427",
    //   "#d81128"
    // ], // randomly assigned colors
    background: "#000000",
    foreground: "#ffffff",
    texture: "marble", // marble | ice
    material: "wood", // metal | glass | plastic | wood
  },
  light_intensity: 1,
  gravity_multiplier: 600,
  baseScale: 80,
  strength: 2,
  onRollComplete: (results) => {
    console.log(`I've got results :>> `, results)
  },
  onRerollComplete: (results) => {
    console.log(`I've got reroll results :>> `, results)
  },
})

Box.initialize()
  .then(() => {
    // give code sandbox a chance to load up
    setTimeout(() => {
      // Box.roll("7d6@4,4,4,4,4,4,4")
      // Box.roll("1d2+1d4+1d6+1d8+1d10+1d12+1d20+1d100");
    }, 1000)
  })
  .catch((e) => console.error(e))

const rollBtn = document.getElementById("rollBtn")
rollBtn.addEventListener("click", async () => {
  // dynamically update the dice theme on each roll
  const colors = ["#00ffcb", "#ff6600", "#1d66af", "#7028ed", "#c4c427", "#d81128"]
  const randomColor = colors[Math.floor(Math.random() * colors.length)]

  // all dice will produce the same value picked from the values list randomly
  const values = [1, 2, 3, 4, 5, 6]
  const randomVal = values[Math.floor(Math.random() * values.length)]

  Box.updateConfig({
    theme_customColorset: {
      background: "#000000",
      foreground: "#ffffff",
      texture: "marble", // marble | ice
      material: "metal", // metal | glass | plastic | wood
    },
  })
  sleep(1000)

  // Box.roll(`1d6`)
  // Box.updateConfig({
  //   theme_customColorset: {
  //     background: "#0000ff",
  //     foreground: "#ffffff",
  //     texture: "marble", // marble | ice
  //     material: "metal", // metal | glass | plastic | wood
  //   },
  // })
  // Box.roll(`2d6`)

  // Box.roll(`5d6+1dpip{r,6}`)
  let total = 0
  const result = await Box.roll("2d6")
  Box.updateConfig({
    theme_customColorset: {
      background: "#00ff00",
      foreground: "#ffffff",
      texture: "marble", // marble | ice
      material: "metal", // metal | glass | plastic | wood
    },
  })
  sleep(1000)
  const wildDie = await Box.add("1d6@6")
  console.log("wildDie:", wildDie)
  // roll.sets.forEach(async ({ value }) => {
  //   if (value > 3) {
  //     console.log("value :>> ", value)
  //   }
  // })
  let wildDieResult = wildDie[0].value
  total = result.total + wildDieResult
  // for (const roll of result.sets[0].rolls) {
  //   console.log("roll:", roll)
  //   if (roll.value > 3) {
  //     console.log("set.value :>> ", roll.value)
  //     await Box.add("1d6")
  //   }
  // }
  while (wildDieResult !== 1) {
    Box.updateConfig({
      theme_customColorset: {
        background: "#00ffff",
        foreground: "#ffffff",
        texture: "marble", // marble | ice
        material: "metal", // metal | glass | plastic | wood
      },
    })
    sleep(1000)
    // const reroll = await Box.reroll([2])
    const wildDieNext = await Box.add("1d6")
    total += wildDieNext[0].value
    wildDieResult = wildDieNext[0].value
    console.log("Box.getDiceResults() :>> ", Box.getDiceResults(), total)
  }
  // await Box.add("1d6")

  // await Box.reroll([0, 1])
  // await Box.add("3d6")
  console.log("Box.getDiceResults() :>> ", Box.getDiceResults(), total)

  // Box.roll([
  //   {
  //     modifier: 0,
  //     qty: 1,
  //     sides: 6,
  //     themeColor: "#ff0000",
  //   },
  //   {
  //     modifier: 0,
  //     qty: 2,
  //     sides: 6,
  //     themeColor: "#0000ff",
  //   },
  // ])
})

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
