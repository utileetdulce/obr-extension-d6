import OBR from "@owlbear-rodeo/sdk"
import { useEffect } from "react"
import { useRole } from "./useRole"
import { MESSAGE_CHANNEL_GM, MESSAGE_CHANNEL_PUBLIC } from "../constants"
import { useMessageHistory } from "./useMessageHistory"

export const useMessageSubscription = () => {
  const { history, pushMessageToHistory } = useMessageHistory()
  const { isGm } = useRole()

  useEffect(() => {
    if (isGm) {
      return OBR.broadcast.onMessage(MESSAGE_CHANNEL_GM, (event) => {
        console.log(event.data)
        try {
          OBR.notification.show(`${event.data}`)
          pushMessageToHistory(event.data)
        } catch (error) {
          console.error(error)
        }
      })
    }
  }, [isGm, pushMessageToHistory])

  useEffect(() => {
    return OBR.broadcast.onMessage(MESSAGE_CHANNEL_PUBLIC, (event) => {
      try {
        OBR.notification.show(`${event.data}`)
        pushMessageToHistory(event.data)
      } catch (error) {
        console.error(error)
      }
    })
  }, [pushMessageToHistory])

  return { history }
}
