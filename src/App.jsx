import { useState } from "react"
import "./App.css"
import OBR from "@owlbear-rodeo/sdk"

function App() {
  const [count, setCount] = useState([0])

  const onClick = () => {
    const wuerfelWurf = rollD6(2)
    OBR.notification.show(`count is ${wuerfelWurf}`)
    setCount(wuerfelWurf)
  }

  return (
    <>
      <button onClick={onClick}>Gewürfelt wurde [{count.join(", ")}]</button>
    </>
  )
}

function rollD6(diceCount = 1) {
  const rolls = []
  for (let i = 0; i < diceCount; i++) {
    rolls.push(Math.floor(Math.random() * 6) + 1)
  }
  return rolls
}

export default App
