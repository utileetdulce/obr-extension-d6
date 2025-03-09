import OBR from "@owlbear-rodeo/sdk"
import { useCallback, useEffect, useRef } from "react"
import { useRole } from "./useRole"
import { MESSAGE_CHANNEL_GM, MESSAGE_CHANNEL_PUBLIC } from "../constants"
import { useMessageHistory } from "./useMessageHistory"
import { useRollVisualizer } from "./useRollVisualizer"
import { usePlayer } from "./usePlayer"

export const useMessageSubscription = (ready, box) => {
  const { history, pushMessageToHistory } = useMessageHistory()
  const player = usePlayer(ready)
  const { isGm } = useRole(ready)
  const { roll } = useRollVisualizer(box)
  const rollQueue = useRef(Promise.resolve())

  const enqueueRoll = useCallback(
    (data) => {
      rollQueue.current = rollQueue.current.then(() => roll(data)).catch(console.error)
    },
    [roll],
  )

  useEffect(() => {
    if (ready) {
      return OBR.broadcast.onMessage(MESSAGE_CHANNEL_GM, async (event) => {
        if (isGm || event.data?.player?.name === player.name)
          try {
            if (event.data.data && event.data.player.name !== player.name) {
              enqueueRoll(event.data.data)
            }
            if (event.data.message) {
              OBR.notification.show(`${event.data.message}`)
            }
            if (event.data.history) {
              pushMessageToHistory(`(Private) ${event.data.message}`, event.data.result)
            }
          } catch (error) {
            console.error(error)
          }
      })
    }
  }, [isGm, ready, pushMessageToHistory, roll, player.name, enqueueRoll])

  useEffect(() => {
    if (ready) {
      return OBR.broadcast.onMessage(MESSAGE_CHANNEL_PUBLIC, async (event) => {
        console.log(" asdf:", event.data)
        try {
          if (event.data.data && event.data?.player?.name !== player.name) {
            enqueueRoll(event.data.data)
          }
          if (event.data.message) {
            OBR.notification.show(`${event.data.message}`)
          }
          if (event.data.history) {
            pushMessageToHistory(event.data.message, event.data.result)
          }
        } catch (error) {
          console.error(error)
        }
      })
    }
  }, [ready, pushMessageToHistory, roll, player.name, enqueueRoll])

  return { history }
}
