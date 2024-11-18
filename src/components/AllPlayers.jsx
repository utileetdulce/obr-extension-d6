import OBR from "@owlbear-rodeo/sdk"
import { Sheet } from "./Sheet"
import { useEffect, useState } from "react"
import { styled } from "styled-components"
import { useProbe } from "../hooks/useProbe"

const Container = styled.div`
  height: 100%;
  overflow-y: scroll;
`

export function AllPlayers() {
  const [players, setPlayers] = useState([])
  const { rollForRow } = useProbe(false)

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
          rollForRow={rollForRow}
          attributes={player.metadata.attributes}
          attributeClasses={player.metadata.attributeClasses}
        />
      ))}
    </Container>
  )
}
