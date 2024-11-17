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
import { useAttributes } from "../hooks/useAttributes"
import { useProbe } from "../hooks/useProbe"

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
  const { attributes, setAttributes, attributeClasses, setAttributeClasses } = useAttributes()

  const { history } = useMessageSubscription()
  const [isPublicRoll, setIsPublicRoll] = useState(true)
  const { result, rollForRow } = useProbe(isPublicRoll)

  useEffect(() => {
    OBR.onReady(() => {
      console.log("OBR is ready !")
      setReady(true)
    })
  }, [])

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
