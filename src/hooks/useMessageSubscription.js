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
    if (isGm && ready) {
      return OBR.broadcast.onMessage(MESSAGE_CHANNEL_GM, (event) => {
        console.log(event.data)
        try {
          OBR.notification.show(`${event.data.message}`)
          pushMessageToHistory(`Private: ${event.data.message}`)
          if (event.data.data) {
            roll(event.data.data)
          }
        } catch (error) {
          console.error(error)
        }
      })
    }
  }, [isGm, ready, pushMessageToHistory, roll])

  useEffect(() => {
    if (ready) {
      return OBR.broadcast.onMessage(MESSAGE_CHANNEL_PUBLIC, async (event) => {
        try {
          if (event.data.data && event.data.data.player.name !== player.name) {
            await roll(event.data.data)
          }
          if (event.data.message) {
            OBR.notification.show(`${event.data.message}`)
            pushMessageToHistory(event.data.message)
          }
        } catch (error) {
          console.error(error)
        }
      })
    }
  }, [ready, pushMessageToHistory, roll])

  return { history }
}
