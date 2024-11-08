import OBR from "@owlbear-rodeo/sdk"
import { useEffect, useState } from "react"

const GAME_MASTER = "GM"
const PLAYER = "PLAYER"

export const useRole = () => {
  const [role, setRole] = useState(PLAYER)

  useEffect(() => {
    OBR.player.getRole().then((role) => {
      setRole(role)
    })
  }, [])

  return { role, isGm: role === GAME_MASTER }
}
