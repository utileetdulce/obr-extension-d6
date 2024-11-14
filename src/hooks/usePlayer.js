import OBR from "@owlbear-rodeo/sdk"
import { useEffect, useState } from "react"

export const usePlayer = () => {
  const [player, setPlayer] = useState({})

  useEffect(() => {
    OBR.player.getName().then((name) => setPlayer((player) => ({ ...player, name })))

    // return OBR.player.onChange(setPlayer)
  }, [])

  return player
}
