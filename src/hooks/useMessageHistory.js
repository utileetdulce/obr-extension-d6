import { useCallback, useState } from "react"

export const useMessageHistory = () => {
  const [historyLength, setHistoryLength] = useState(100)
  const [history, setHistory] = useState([])

  const pushMessageToHistory = useCallback(
    (message, result) => {
      setHistory((history) => {
        return [{ message, result }, ...history.slice(0, historyLength - 1)]
      })
    },
    [historyLength],
  )

  return { history, setHistory, pushMessageToHistory, setHistoryLength }
}
