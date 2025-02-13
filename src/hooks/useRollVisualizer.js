import { COLORSETS } from "../components/DiceBox/const/colorsets"

export const useRollVisualizer = (box) => {
  const roll = async ({ result = [], type = "regular" }) => {
    if (!box) return

    // await delay(2000)
    console.log("useRollVisualizer result:", result)
    console.log("box:", box)

    const numDice = result.length

    if (type === "regular") {
      await box.roll(`${numDice}d6@${result.join(",")}`)
    }
    if (type === "explode") {
      await box.add(`1d6@${result[0]}`, COLORSETS.green)
    }
    if (type === "fail") {
      await box.add(`1d6@${result[0]}`, COLORSETS.red)
    }
  }

  return {
    roll,
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
