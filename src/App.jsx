import { useState } from "react"
import "./App.css"
import OBR from "@owlbear-rodeo/sdk"
import Sheet from "./Sheet"

function App() {
  const [count, setCount] = useState([])

  const onClick = () => {
    const wuerfelWurf = rollD6(2)
    OBR.notification.show(`count is ${wuerfelWurf}`)
    setCount(wuerfelWurf)
  }

  return (
    <div style={{}}>
      <button onClick={onClick}>Gewürfelt wurde [{count.join(", ")}]</button>
      {count.length > 0 && (
        <div style={{ display: "flex" }}>
          {count.map((item, index) => (
            <div key={index}>
              <img
                width={"20px"}
                src={`./dice-${item}.svg`}
                style={{ background: index === 0 ? "red" : "transparent" }}
                alt={`dice-${item}`}
              />
            </div>
          ))}
          Sum: {count.reduce((a, b) => a + b, 0)}
        </div>
      )}

      <Sheet />
    </div>
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
