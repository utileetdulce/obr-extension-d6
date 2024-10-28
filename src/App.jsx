import OBR from "@owlbear-rodeo/sdk"
import "./App.css"
import Sheet from "./Sheet"
import { useEffect, useState } from "react"

function App() {
  const [ready, setReady] = useState(true)

  // useEffect(() => {
  //   OBR.onReady = () => {
  //     OBR.log("AAAAAAAAAAAAAAAAAAA")
  //     setReady(true)
  //   }
  // }, [])

  return <>{ready && <Sheet />}</>
}

export default App
