import OBR from "@owlbear-rodeo/sdk"
import { useState } from "react"
import { MESSAGE_CHANNEL_GM, MESSAGE_CHANNEL_PUBLIC } from "../constants"
import { getQualityRating, rollD6Dices } from "../utils"

export const useProbe = (isPublicRoll, player, box) => {
  const [result, setResult] = useState(null)

  const rollForRow = async ({ attribute, numDice, modifier }) => {
    if (!box) return

    await box.updateConfig({
      theme_customColorset: {
        name: "Test",
        category: "Colors",
        foreground: ["#00FF00", "#0000FF", "#FF0000"],
        background: ["#FF0000", "#00FF00", "#0000FF"],
        outline: "black",
        texture: "none",
        description: "Test",
      },
    })

    let wildDieStatus = "normal"
    const regularRolls = rollD6Dices(numDice)
    const wildDieRolls = []
    console.log("result:", regularRolls)

    await box.roll(`${numDice}d6@${regularRolls.join(",")}`)
    // await box.updateConfig({
    //   theme_customColorset: {
    //     name: "Fire",
    //     category: "Damage Types",
    //     foreground: "#fff",
    //     background: ["#000", "#000", "#000", "#000", "#000"],
    //     outline: "black",
    //     texture: "fire",
    //     description: "Fire",
    //   },
    // })
    // await box.add(`1d6`)

    let wildDie = regularRolls[0]

    while (wildDie < 3) {
      // await box.updateConfig({
      //   theme_customColorset: {
      //     name: "Fire",
      //     category: "Damage Types",
      //     foreground: "#f8d84f",
      //     background: ["#f8d84f", "#f9b02d", "#f43c04", "#910200", "#4c1009"],
      //     outline: "black",
      //     texture: "fire",
      //     description: "Fire",
      //   },
      // })
      wildDieStatus = "explode"
      const wildDieRoll = await box.add(`1d6`)
      wildDie = wildDieRoll[0].value
      wildDieRolls.push(wildDie)
    }

    if (wildDie === 1) {
      wildDieStatus = "fail"
      const wildDieRoll = await box.add(`1d6`)
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

    // console.log("sim:", sim)
    // await box.updateConfig({
    //   theme_customColorset: {
    //     name: "Fire",
    //     category: "Damage Types",
    //     foreground: "#f8d84f",
    //     background: ["#f8d84f", "#f9b02d", "#f43c04", "#910200", "#4c1009"],
    //     outline: "black",
    //     texture: "fire",
    //     description: "Fire",
    //   },
    // })
    // const regularRolls2 = await box.roll(`2d6`)
    // await box.updateConfig({
    //   theme_customColorset: {
    //     name: "Ice",
    //     category: "Damage Types",
    //     foreground: "#60E9FF",
    //     background: ["#214fa3", "#3c6ac1", "#253f70", "#0b56e2", "#09317a"],
    //     outline: "black",
    //     texture: "ice",
    //     description: "Ice",
    //   },
    // })
  }
  const rollForRow2 = async ({ attribute, numDice, modifier }) => {
    const regularRolls = await box.roll(`${numDice - 1}d6`)
    const wildDieRoll = await box.add(`1d6!r>3@6`)
    console.log("regularRolls:", regularRolls)
    console.log("wildDieRoll:", wildDieRoll)
    let rolls = []
    let wildDieRolls = []
    let wildDieTotal = 0
    let wildDieStatus = "normal"

    // if (wildDieRoll.value === 1) {
    //   wildDieStatus = "fail"
    //   currentWildRoll = rollD6()
    //   wildDieRolls.push(-currentWildRoll)
    //   wildDieTotal -= currentWildRoll
    // } else if (currentWildRoll === 6) {
    //   wildDieStatus = "explode"
    //   wildDieTotal = currentWildRoll
    //   currentWildRoll = rollD6()
    //   while (currentWildRoll === 6) {
    //     wildDieRolls.push(currentWildRoll)
    //     wildDieTotal += currentWildRoll
    //     currentWildRoll = rollD6()
    //   }
    //   wildDieRolls.push(currentWildRoll)
    //   wildDieTotal += currentWildRoll
    // } else {
    //   wildDieTotal = currentWildRoll
    // }

    // // Roll the regular dice
    // for (let i = 0; i < numDice - 1; i++) {
    //   rolls.push(rollD6())
    // }

    // // Calculate total
    // const regularTotal = rolls.reduce((sum, roll) => sum + roll, 0)
    const total = regularRolls.total + wildDieRoll[0].value + modifier
    console.log("total:", total)

    const quality = getQualityRating(total)

    // const [firstWildDie, ...restWildDie] = wildDieRolls
    // const diceString = `${rolls.join("+")}${firstWildDie === 1 ? restWildDie.join("") : "+" + wildDieRolls.join("+")}${modifier ? "+" + modifier : ""}=${total}`

    // const quality = "good"
    const diceString = "wd"
    setResult({
      rolls: {
        regular: rolls,
        wild: wildDieRolls,
      },
      attribute,
      total,
      modifier,
      wildDieStatus,
      quality,
      diceString,
    })

    await OBR.broadcast.sendMessage(
      isPublicRoll ? MESSAGE_CHANNEL_PUBLIC : MESSAGE_CHANNEL_GM,
      `${player.name}s ${attribute} ist ${quality.text} (${diceString}) ${quality.icon}`,
      { destination: "ALL" },
    )
  }

  return {
    result,
    rollForRow,
  }
}
