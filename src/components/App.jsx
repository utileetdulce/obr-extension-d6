import OBR from "@owlbear-rodeo/sdk"
import { Sheet } from "./Sheet"
import { useEffect, useState } from "react"
import styled from "styled-components"
import { AllPlayers } from "./AllPlayers"
import { usePlayer } from "../hooks/usePlayer"
import { useRole } from "../hooks/useRole"
import { useMessageSubscription } from "../hooks/useMessageSubscription"
import { RollResult } from "./RollResult"
import { MessageHistory } from "./MessageHistory"
import { SliderButton } from "./SliderButton"
import { getQualityRating, rollD6 } from "../utils"
import { MESSAGE_CHANNEL_GM, MESSAGE_CHANNEL_PUBLIC } from "../constants"
import { useAttributes } from "../hooks/useAttributes"

const TABS = {
  MY_PLAYER: "MY_PLAYER",
  ALL_PLAYERS: "ALL_PLAYERS",
}

const TabNavigation = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`

const TabContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const Container = styled.div`
  width: 512px;
  height: 700px;
  box-sizing: border-box;
  overflow-y: scroll;
  font-family: "Arial", sans-serif;
  padding: 20px;
  background-color: #f5f5f5;
  color: black;
`

function App() {
  const [ready, setReady] = useState(!OBR.isAvailable)
  const [tab, setTab] = useState(TABS.MY_PLAYER)
  const player = usePlayer()
  const { isGm } = useRole()
  const [result, setResult] = useState(null)
  const { attributes, setAttributes, attributeClasses, setAttributeClasses } = useAttributes()

  const { history } = useMessageSubscription()
  const [isPublicRoll, setIsPublicRoll] = useState(true)

  useEffect(() => {
    OBR.onReady(() => {
      console.log("OBR is ready !")
      setReady(true)
    })
  }, [])

  const rollForRow = async ({ attribute, numDice, modifier }) => {
    let rolls = []
    let wildDieRolls = []
    let wildDieTotal = 0
    let wildDieStatus = "normal"

    // Roll the wild die first
    let currentWildRoll = rollD6()
    wildDieRolls.push(currentWildRoll)

    if (currentWildRoll === 1) {
      wildDieStatus = "fail"
      currentWildRoll = rollD6()
      wildDieRolls.push(-currentWildRoll)
      wildDieTotal -= currentWildRoll
    } else if (currentWildRoll === 6) {
      wildDieStatus = "explode"
      wildDieTotal = currentWildRoll
      currentWildRoll = rollD6()
      while (currentWildRoll === 6) {
        wildDieRolls.push(currentWildRoll)
        wildDieTotal += currentWildRoll
        currentWildRoll = rollD6()
      }
      wildDieRolls.push(currentWildRoll)
      wildDieTotal += currentWildRoll
    } else {
      wildDieTotal = currentWildRoll
    }

    // Roll the regular dice
    for (let i = 0; i < numDice - 1; i++) {
      rolls.push(rollD6())
    }

    // Calculate total
    const regularTotal = rolls.reduce((sum, roll) => sum + roll, 0)
    const total = regularTotal + wildDieTotal + modifier

    const quality = getQualityRating(total)

    const [firstWildDie, ...restWildDie] = wildDieRolls
    const diceString = `${rolls.join("+")}${firstWildDie === 1 ? restWildDie.join("") : "+" + wildDieRolls.join("+")}${modifier ? "+" + modifier : ""}=${total}`

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

  if (!ready) return null

  return (
    <Container>
      <TabNavigation>
        <button onClick={() => setTab(TABS.MY_PLAYER)}>My Player</button>
        {isGm && <button onClick={() => setTab(TABS.ALL_PLAYERS)}>All Players</button>}
      </TabNavigation>
      <TabContainer>
        {tab === TABS.MY_PLAYER && (
          <Sheet
            player={player}
            attributes={attributes}
            rollForRow={rollForRow}
            setAttributes={setAttributes}
            attributeClasses={attributeClasses}
            setAttributeClasses={setAttributeClasses}
          />
        )}
        {tab === TABS.ALL_PLAYERS && <AllPlayers />}
        <SliderButton
          isOn={isPublicRoll}
          onStateChange={setIsPublicRoll}
          onCaption={"Public Roll"}
          offCaption={"Private Roll"}
        />
        <RollResult result={result} />
        <MessageHistory history={history} />
      </TabContainer>
    </Container>
  )
}

export default App
