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

  return (
    <Container>
      {players.map((player) => (
        <Sheet
          key={player.id}
          player={player}
          isPublicRoll={isPublicRoll}
          attributes={player.metadata.attributes}
          attributeClasses={player.metadata.attributeClasses}
        />
      ))}
    </Container>
  )
}
