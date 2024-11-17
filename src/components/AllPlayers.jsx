import OBR from "@owlbear-rodeo/sdk"
import { Sheet } from "./Sheet"
import { useEffect, useState } from "react"
import styled from "styled-components"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export function AllPlayers() {
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
      {players.map((player, index) => (
        <Sheet
          key={player.id + index}
          player={player}
          attributes={player.metadata.attributes}
          attributeClasses={player.metadata.attributeClasses}
        />
      ))}
    </Container>
  )
}
