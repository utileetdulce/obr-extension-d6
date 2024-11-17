import OBR from "@owlbear-rodeo/sdk"
import { Sheet } from "./Sheet"
import { useEffect, useState } from "react"
import { mockObr } from "../obrMock"
import styled from "styled-components"
import { AllPlayers } from "./AllPlayers"
import { usePlayer } from "../hooks/usePlayer"
import { useRole } from "../hooks/useRole"

const TABS = {
  MY_PLAYER: "MY_PLAYER",
  ALL_PLAYERS: "ALL_PLAYERS",
}

const TabNavigation = styled.div`
  position: absolute;
  height: 20px;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`

const TabContainer = styled.div`
  position: absolute;
  top: 20px;
  display: flex;
  justify-content: center;
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
  const [ready, setReady] = useState(false)
  const [tab, setTab] = useState(TABS.MY_PLAYER)
  const [attributes, setAttributes] = useState(initialAttributes)
  const [attributeClasses, setAttributeClasses] = useState(initialAttributeClasses)
  const player = usePlayer()
  const { isGm } = useRole()

  useEffect(() => {
    if (!OBR.isAvailable) {
      setReady(true)
    }
    OBR.onReady(() => {
      console.log("OBR is ready !")
      setReady(true)
    })
  }, [])

  if (!ready) return null

  return (
    <>
      <TabNavigation>
        <button onClick={() => setTab(TABS.MY_PLAYER)}>My Player</button>
        {isGm && <button onClick={() => setTab(TABS.ALL_PLAYERS)}>All Players</button>}
      </TabNavigation>
      <TabContainer>
        {tab === TABS.MY_PLAYER && (
          <Sheet
            player={player}
            attributes={attributes}
            setAttributes={setAttributes}
            attributeClasses={attributeClasses}
            setAttributeClasses={setAttributeClasses}
          />
        )}
        {tab === TABS.ALL_PLAYERS && <AllPlayers />}
      </TabContainer>
    </>
  )
}

export default App
