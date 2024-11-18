import OBR from "@owlbear-rodeo/sdk"
import { useEffect, useState } from "react"

export const usePlayer = (ready) => {
  const [player, setPlayer] = useState({})

  useEffect(() => {
    if (ready) {
      OBR.player.getName().then((name) => setPlayer((player) => ({ ...player, name })))

      return OBR.player.onChange(setPlayer)
    }
  }, [ready])

  return player
}
