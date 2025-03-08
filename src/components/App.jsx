import OBR from "@owlbear-rodeo/sdk"
import { Sheet } from "./Sheet"
import { useEffect, useState } from "react"
import styled from "styled-components"
import { AllPlayers } from "./AllPlayers"
import { usePlayer } from "../hooks/usePlayer"
import { useRole } from "../hooks/useRole"
import { useMessageSubscription } from "../hooks/useMessageSubscription"
import { MessageHistory } from "./MessageHistory"
import { SliderButton } from "./SliderButton"
import { useAttributes } from "../hooks/useAttributes"
import { useProbe } from "../hooks/useProbe"
import { DiceRoll } from "./DiceRoll"
import { useDiceBox } from "./useDiceBox"

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

const StyledButton = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  width: 230px;

  font-size: 16px;
  margin: 2px 0;

  &:hover {
    background-color: #2980b9;
  }
`

const SaveButton = ({ onClick }) => (
  <StyledButton onClick={onClick}> 💾 Save Attributes to file</StyledButton>
)

const RestoreButton = ({ onChange }) => (
  <>
    <StyledButton as="label" htmlFor="files">
      ↺ Restore attributes from file
    </StyledButton>
    <input id="files" style={{ visibility: "hidden" }} type="file" onChange={onChange} />
  </>
)

function App() {
  const [ready, setReady] = useState(!OBR.isAvailable)
  const [tab, setTab] = useState(TABS.MY_PLAYER)
  const player = usePlayer(ready)
  const { isGm } = useRole(ready)
  const {
    attributes,
    setAttributes,
    attributeClasses,
    setAttributeClasses,
    saveAttibutesToJsonFile,
    restoreAttributesFromJsonFile,
  } = useAttributes()

  const { diceBoxRef, box } = useDiceBox()
  const { history } = useMessageSubscription(ready, box)
  const [isPublicRoll, setIsPublicRoll] = useState(true)
  const { result } = useProbe(isPublicRoll)

  useEffect(() => {
    OBR.onReady(() => {
      console.log("OBR is ready !")
      setReady(true)
    })
  }, [])

  if (!ready) return null

  return (
    <Container>
      <DiceRoll diceBoxRef={diceBoxRef} />
      <TabNavigation>
        <button onClick={() => setTab(TABS.MY_PLAYER)}>My Player</button>
        {isGm && <button onClick={() => setTab(TABS.ALL_PLAYERS)}>All Players</button>}
      </TabNavigation>
      <TabContainer>
        {tab === TABS.MY_PLAYER && (
          <Sheet
            player={player}
            box={box}
            attributes={attributes}
            isPublicRoll={isPublicRoll}
            setAttributes={setAttributes}
            attributeClasses={attributeClasses}
            setAttributeClasses={setAttributeClasses}
          />
        )}
        {tab === TABS.ALL_PLAYERS && <AllPlayers isPublicRoll={isPublicRoll} />}
        <SliderButton
          isOn={isPublicRoll}
          onStateChange={setIsPublicRoll}
          onCaption={"Public Roll"}
          offCaption={"Private Roll"}
        />
        <MessageHistory history={history} />
        <SaveButton onClick={saveAttibutesToJsonFile} />
        <RestoreButton
          onChange={(e) => {
            restoreAttributesFromJsonFile(e.target.files[0])
            e.target.value = ""
          }}
        />
      </TabContainer>
    </Container>
  )
}

export default App
