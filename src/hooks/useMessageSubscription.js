import OBR from "@owlbear-rodeo/sdk"
import { useEffect } from "react"
import { useRole } from "./useRole"
import { MESSAGE_CHANNEL_GM, MESSAGE_CHANNEL_PUBLIC } from "../constants"
import { useMessageHistory } from "./useMessageHistory"
import { useRollVisualizer } from "./useRollVisualizer"
import { usePlayer } from "./usePlayer"

export const useMessageSubscription = (ready, box) => {
  const { history, pushMessageToHistory } = useMessageHistory()
  const player = usePlayer(ready)
  console.log(" player:", player)
  const { isGm } = useRole(ready)
  const { roll } = useRollVisualizer(box)

  useEffect(() => {
    if (ready) {
      return OBR.broadcast.onMessage(MESSAGE_CHANNEL_GM, (event) => {
        if (isGm || event.data?.player?.name === player.name)
          try {
            if (event.data.data && event.data.player.name !== player.name) {
              roll(event.data.data)
            }
            if (event.data.message) {
              OBR.notification.show(`${event.data.message}`)
            }
            if (event.data.history) {
              pushMessageToHistory(`(Private) ${event.data.message}`)
            }
          } catch (error) {
            console.error(error)
          }
      })
    }
  }, [isGm, ready, pushMessageToHistory, roll, player.name])

  useEffect(() => {
    if (ready) {
      return OBR.broadcast.onMessage(MESSAGE_CHANNEL_PUBLIC, async (event) => {
        console.log(" asdf:", event.data)
        try {
          if (event.data.data && event.data?.player?.name !== player.name) {
            await roll(event.data.data)
          }
          if (event.data.message) {
            OBR.notification.show(`${event.data.message}`)
          }
          if (event.data.history) {
            pushMessageToHistory(event.data.message)
          }
        } catch (error) {
          console.error(error)
        }
      })
    }
  }, [ready, pushMessageToHistory, roll, player.name])

  return { history }
}
