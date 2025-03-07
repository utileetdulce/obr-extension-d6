import OBR from "@owlbear-rodeo/sdk"
import { useState } from "react"
import { MESSAGE_CHANNEL_GM, MESSAGE_CHANNEL_PUBLIC } from "../constants"
import { getQualityRating, rollD6Dices } from "../utils"
import { COLORSETS } from "../components/DiceBox/const/colorsets"

export const useProbe = (isPublicRoll, player, box) => {
  console.log(" isPublicRoll:", isPublicRoll)
  const [result, setResult] = useState(null)

  const rollForRow = async ({ attribute, numDice, modifier }) => {
    if (!box) return

    await OBR.broadcast.sendMessage(
      isPublicRoll ? MESSAGE_CHANNEL_PUBLIC : MESSAGE_CHANNEL_GM,
      {
        message: `${player.name}: Probe auf ${attribute} (${numDice}W6 ${modifier ? `+ ${modifier}` : ""})`,
      },
      { destination: "REMOTE" },
    )

    let wildDieStatus = "normal"
    const regularRolls = rollD6Dices(numDice)
    const wildDieRolls = []
    console.log("result:", regularRolls)
    let wildDie = regularRolls[0]

    const rollText = {
      1: "fail! ",
      2: "",
      3: "",
      4: "",
      5: "",
      6: "explode! ",
    }

    await OBR.broadcast.sendMessage(
      isPublicRoll ? MESSAGE_CHANNEL_PUBLIC : MESSAGE_CHANNEL_GM,
      {
        message:
          wildDie === 6 || wildDie === 1
            ? `${regularRolls.join(" + ")} ${modifier ? `+ ${modifier}` : ""}`
            : null,
        data: { result: regularRolls, type: "regular" },
        player,
      },
      { destination: "REMOTE" },
    )

    await box.roll(`${numDice}d6@${regularRolls.join(",")}`)

    if (wildDie === 6) {
      while (wildDie === 6) {
        const wildDieResult = rollD6Dices(1)
        await OBR.broadcast.sendMessage(
          isPublicRoll ? MESSAGE_CHANNEL_PUBLIC : MESSAGE_CHANNEL_GM,
          {
            message: `${player.name}: ${rollText[wildDie]} + ${wildDieResult}`,
            data: { result: wildDieResult, type: "explode" },
            player,
          },
          { destination: "REMOTE" },
        )
        wildDieStatus = "explode"
        const wildDieRoll = await box.add(`1d6@${wildDieResult}`, COLORSETS.green)
        wildDie = wildDieRoll[0].value
        wildDieRolls.push(wildDie)
      }
    } else if (wildDie === 1) {
      const wildDieResult = rollD6Dices(1)
      await OBR.broadcast.sendMessage(
        isPublicRoll ? MESSAGE_CHANNEL_PUBLIC : MESSAGE_CHANNEL_GM,
        {
          message: `${player.name}s: ${rollText[wildDie]} - ${wildDieResult}`,
          data: { result: wildDieResult, type: "fail" },
          player,
        },
        { destination: "REMOTE" },
      )
      wildDieStatus = "fail"
      const wildDieRoll = await box.add(`1d6@${wildDieResult}`, COLORSETS.red)
      wildDieRolls.push(-wildDieRoll[0].value)
    }

    const regularRollsTotal = regularRolls.reduce((sum, roll) => sum + roll, 0)
    const wildDieTotal = wildDieRolls.reduce((sum, roll) => sum + roll, 0)
    const total = regularRollsTotal + wildDieTotal + modifier
    const quality = getQualityRating(total)

    await OBR.broadcast.sendMessage(
      isPublicRoll ? MESSAGE_CHANNEL_PUBLIC : MESSAGE_CHANNEL_GM,
      {
        message: `${player.name}: ${attribute} war ${quality.text} (${[...regularRolls, ...wildDieRolls, modifier].reduce((a, c) => a + (c !== 0 ? (c < 0 ? "" : "+") + c : ""))} = ${total})`,
        history: true,
        player,
      },
      { destination: "ALL" },
    )

    console.log("result", {
      regularRolls,
      regularRollsTotal,
      wildDieRolls,
      wildDieTotal,
      total,
      quality,
    })

    const [firstWildDie, ...restWildDie] = wildDieRolls
    const diceString = `${regularRolls.join("+")}${firstWildDie === 1 ? restWildDie.join("") : "+" + wildDieRolls.join("+")} ${modifier ? "+" + modifier : ""}=${total}`

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
