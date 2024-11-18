import OBR from "@owlbear-rodeo/sdk"
import { useEffect, useState } from "react"

const GAME_MASTER = "GM"
const PLAYER = "PLAYER"

export const useRole = (ready) => {
  const [role, setRole] = useState(PLAYER)

  useEffect(() => {
    if (ready) {
      OBR.player.getRole().then((role) => {
        setRole(role)
      })
    }
  }, [ready])

  return { role, isGm: role === GAME_MASTER }
}
