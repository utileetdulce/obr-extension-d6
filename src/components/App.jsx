import OBR from "@owlbear-rodeo/sdk"
import Sheet from "./Sheet"
import { useEffect, useState } from "react"
import { mockObr } from "../obr"

function App() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!OBR.isAvailable) {
      mockObr()
      setReady(true)
    }
    OBR.onReady(() => {
      console.log("OBR is ready !")
      setReady(true)
    })
  }, [])

  return <>{ready && <Sheet />}</>
}

export default App
