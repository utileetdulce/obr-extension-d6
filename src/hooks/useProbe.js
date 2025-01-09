import OBR from "@owlbear-rodeo/sdk"
import { useState } from "react"
import { MESSAGE_CHANNEL_GM, MESSAGE_CHANNEL_PUBLIC } from "../constants"
import { getQualityRating, rollD6Dices } from "../utils"
import { COLORSETS } from "../components/DiceBox/const/colorsets"

export const useProbe = (isPublicRoll, player, box) => {
  const [result, setResult] = useState(null)

  const rollForRow = async ({ attribute, numDice, modifier }) => {
    if (!box) return

    let wildDieStatus = "normal"
    const regularRolls = rollD6Dices(numDice)
    const wildDieRolls = []
    console.log("result:", regularRolls)

    let wildDie = regularRolls[0]
    const wildDieColors = {
      1: COLORSETS.red,
      2: COLORSETS.blue,
      3: COLORSETS.blue,
      4: COLORSETS.blue,
      5: COLORSETS.blue,
      6: COLORSETS.green,
    }
    // await box.roll(`${numDice}d6@${regularRolls.join(",")}`, wildDieColors[wildDie])
    await box.roll(`${numDice}d6@${regularRolls.join(",")}`)

    while (wildDie === 6) {
      wildDieStatus = "explode"
      const wildDieRoll = await box.add(`1d6`, COLORSETS.green)
      wildDie = wildDieRoll[0].value
      wildDieRolls.push(wildDie)
    }

    if (wildDie === 1) {
      wildDieStatus = "fail"
      const wildDieRoll = await box.add(`1d6`, COLORSETS.red)
      wildDieRolls.push(-wildDieRoll[0].value)
    }

    const regularRollsTotal = regularRolls.reduce((sum, roll) => sum + roll, 0) + modifier
    const wildDieTotal = wildDieRolls.reduce((sum, roll) => sum + roll, 0)
    const total = regularRollsTotal + wildDieTotal
    const quality = getQualityRating(total)
    console.log("result", {
      regularRolls,
      regularRollsTotal,
      wildDieRolls,
      wildDieTotal,
      total,
      quality,
    })

    const [firstWildDie, ...restWildDie] = wildDieRolls
    const diceString = `${regularRolls.join("+")}${firstWildDie === 1 ? restWildDie.join("") : "+" + wildDieRolls.join("+")}${modifier ? "+" + modifier : ""}=${total}`

    setResult({
      rolls: {
        regular: regularRolls,
        wild: wildDieRolls,
      },
      attribute,
      total,
      modifier,
      wildDieStatus,
      quality,
      diceString,
    })
  }

  return {
    result,
    rollForRow,
  }
}
