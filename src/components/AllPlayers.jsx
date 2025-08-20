import OBR from "@owlbear-rodeo/sdk"
import { Sheet } from "./Sheet"
import { useEffect, useState } from "react"
import { styled } from "styled-components"

const Container = styled.div`
  height: 100%;
  overflow-y: scroll;
`

export function AllPlayers({ isPublicRoll }) {
  const [players, setPlayers] = useState([])

  useEffect(() => {
    const initPlayers = async () => {
      const players = await OBR.party.getPlayers()
      console.log("players:", players)
      setPlayers(players.filter((player) => player.metadata.attributes))
    }
    initPlayers()
  }, [])

  const downloadAllCharacters = () => {
    const allData = players.map((player) => ({
      id: player.id,
      name: player.name,
      attributes: player.metadata.attributes,
      attributeClasses: player.metadata.attributeClasses,
    }))
    const element = document.createElement("a")
    const file = new Blob([JSON.stringify(allData, null, 2)], { type: "application/json" })
    element.href = URL.createObjectURL(file)
    element.download = `all-characters-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <Container>
      <button style={{ margin: "8px", padding: "6px 12px" }} onClick={downloadAllCharacters}>
        Download all characters data
      </button>
      {players.map((player, index) => (
        <Sheet
          key={player.id + index}
          player={player}
          isPublicRoll={isPublicRoll}
          attributes={player.metadata.attributes}
          attributeClasses={player.metadata.attributeClasses}
        />
      ))}
    </Container>
  )
}
