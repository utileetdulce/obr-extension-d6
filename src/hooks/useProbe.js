import OBR from "@owlbear-rodeo/sdk"
import { MESSAGE_CHANNEL_GM, MESSAGE_CHANNEL_PUBLIC } from "../constants"
import { getQualityRating, rollD6Dices } from "../utils"
import { COLORSETS } from "../components/DiceBox/const/colorsets"

export const useProbe = (isPublicRoll, player, box) => {
  const rollForRow = async ({ attribute, numDice, modifier }) => {
    if (!box) return

    await OBR.broadcast.sendMessage(
      isPublicRoll ? MESSAGE_CHANNEL_PUBLIC : MESSAGE_CHANNEL_GM,
      {
        message: `${player.name}: Probe auf ${attribute} (${numDice}W6 ${modifier ? `+ ${modifier}` : ""})`,
      },
      { destination: "REMOTE" },
    )

    const regularRolls = rollD6Dices(numDice)
    const wildDieRolls = []
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
        message: `${player.name}: ${attribute} war ${quality.text}`,
        result: {
          regularRolls,
          wildDieRolls,
          modifier,
          total,
        },
        history: true,
        player,
      },
      { destination: "ALL" },
    )
  }

  return {
    rollForRow,
  }
}
