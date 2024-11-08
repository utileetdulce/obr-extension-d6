import { useCallback, useState } from "react"

export const useMessageHistory = () => {
  const [historyLength, setHistoryLength] = useState(6)
  const [history, setHistory] = useState([])

  const pushMessageToHistory = useCallback(
    (message) => {
      setHistory((history) => {
        return [message, ...history.slice(0, historyLength - 1)]
      })
    },
    [historyLength],
  )

  return { history, setHistory, pushMessageToHistory, setHistoryLength }
}
