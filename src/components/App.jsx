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

const initialAttributes = [
  { attribute: "Akrobatik", numDice: 2, modifier: 0, class: "physis" },
  { attribute: "Klingenkampf", numDice: 2, modifier: 0, class: "reflexe" },
  { attribute: "Schusswaffen", numDice: 2, modifier: 0, class: "koordination" },
  { attribute: "Reiten", numDice: 2, modifier: 0, class: "koordination" },
  { attribute: "Alchemie", numDice: 2, modifier: 0, class: "ratio" },
  { attribute: "Umgarnen", numDice: 2, modifier: 0, class: "auftreten" },
  { attribute: "Lügen erkennen", numDice: 2, modifier: 0, class: "wahrnehmung" },
]

const initialAttributeClasses = {
  physis: {
    attribute: "Physis",
    numDice: 2,
    modifier: 0,
  },
  reflexe: {
    attribute: "Reflexe",
    numDice: 2,
    modifier: 0,
  },
  koordination: {
    attribute: "Koordination",
    numDice: 2,
    modifier: 0,
  },
  ratio: {
    attribute: "Ratio",
    numDice: 2,
    modifier: 0,
  },
  auftreten: {
    attribute: "Auftreten",
    numDice: 2,
    modifier: 0,
  },
  wahrnehmung: {
    attribute: "Wahrnehmung",
    numDice: 2,
    modifier: 0,
  },
}

function App() {
  const [ready, setReady] = useState(!OBR.isAvailable)
  const [tab, setTab] = useState(TABS.MY_PLAYER)
  const [attributes, setAttributes] = useState(initialAttributes)
  const [attributeClasses, setAttributeClasses] = useState(initialAttributeClasses)
  const player = usePlayer()
  const { isGm } = useRole()
  const [result, setResult] = useState(null)

  const { history } = useMessageSubscription()
  const [isPublicRoll, setIsPublicRoll] = useState(true)

  useEffect(() => {
    OBR.onReady(() => {
      console.log("OBR is ready !")
      setReady(true)
    })
  }, [])

  useEffect(() => {
    OBR.player.setMetadata({ attributes, attributeClasses })
  }, [attributes, attributeClasses, player])

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
