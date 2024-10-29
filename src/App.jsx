import OBR from "@owlbear-rodeo/sdk"
import "./App.css"
import Sheet from "./Sheet"
import { useEffect, useState } from "react"

function App() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    OBR.onReady(() => {
      console.log("OBR is ready !!!!!!!!!!!!!!!!!!!!!!!")

      setReady(true)
    })
  }, [])

  return <>{ready && <Sheet />}</>
}

export default App
