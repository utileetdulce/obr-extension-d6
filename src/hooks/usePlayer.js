import OBR from "@owlbear-rodeo/sdk"
import { useEffect, useState } from "react"
import { useLocalStorage } from "@uidotdev/usehooks"

export const usePlayer = (ready) => {
  const [playerData, setPlayerData] = useState({})
  const [notes, setNotes] = useLocalStorage("playerNotes", "")

  useEffect(() => {
    if (ready) {
      OBR.player.getName().then((name) => setPlayerData((player) => ({ ...player, name })))

      // return OBR.player.onChange(setPlayer)
    }
  }, [ready])

  const updatePlayer = (updatedData) => {
    if (updatedData.notes !== undefined) {
      setNotes(updatedData.notes)
    } else {
      setPlayerData((prevPlayer) => ({ ...prevPlayer, ...updatedData }))
    }
  }

  return { ...playerData, notes, updatePlayer }
}
