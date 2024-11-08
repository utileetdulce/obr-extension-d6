import { useEffect, useState } from "react"
import { styled } from "styled-components"

import { SliderButton } from "./SliderButton"
import { Row } from "./Row"
import { rollD6, getQualityRating } from "../utils"
import OBR from "@owlbear-rodeo/sdk"
import { AdjustButton } from "./AdjustButton"
import { useRole } from "../hooks/useRole"
import { usePlayer } from "../hooks/usePlayer"

const MESSAGE_CHANNEL_PUBLIC = "com.onrender.obr-extension-d6.public"
const MESSAGE_CHANNEL_GM = "com.onrender.obr-extension-d6.gm"
const WILD_DIE_STATUS_TEXT = {
  normal: "",
  fail: "Patzer! ",
  explode: "Kritischer Treffer! ",
}

const Container = styled.div`
  width: 500px;
  height: 670px;
  font-family: "Arial", sans-serif;
  padding: 20px;
  background-color: #f5f5f5;
  color: black;
`

const Table = styled.table`
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
`

const Th = styled.th`
  padding: 12px;
  text-align: center;
  border: 1px solid #ddd;
  background-color: #2c3e50;
  color: white;
`

const Td = styled.td`
  padding: 2px;
  text-align: left;
  border: 1px solid #ddd;
`

const Result = styled.div`
  height: 80px;
  color: black;
  margin-top: 20px;
  padding: 0 15px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
`

const DiceDetail = styled.div`
  color: #666;
  font-size: 0.9em;
  margin-top: 5px;
`

const DiceContainer = styled.div`
  display: flex;
  justify-content: center;
`

const DiceImage = styled.img`
  width: 40px;

  background-color: black;
  border-radius: 4px;

  &.normal {
    background-color: blue;
  }

  &.fail {
    background-color: red;
  }

  &.explode {
    background-color: green;
  }
`

const QualityRating = styled.div`
  margin-top: 10px;
  padding: 8px;
  border-radius: 4px;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.5);
`

const History = styled.div`
  margin-top: 20px;
  padding: 10px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
`

const initialAttributes = [
  { attribute: "Reflexe", numDice: 2, modifier: 0 },
  { attribute: "Koordination", numDice: 2, modifier: 0 },
  { attribute: "Physis", numDice: 2, modifier: 0 },
  { attribute: "Ratio", numDice: 2, modifier: 0 },
  { attribute: "Auftreten", numDice: 2, modifier: 0 },
  { attribute: "Wahrnehmung", numDice: 2, modifier: 0 },
  { numDice: 2, modifier: 0 },
  { numDice: 2, modifier: 0 },
  { numDice: 2, modifier: 0 },
]

const Sheet = () => {
  const [result, setResult] = useState(null)
  const { isGm } = useRole()
  const player = usePlayer()
  const [isPublicRoll, setIsPublicRoll] = useState(true)
  const [history, setHistory] = useState([])
  const [attributes, setAttributes] = useState(initialAttributes)

  const pushMessageToHistory = (message) => {
    setHistory((history) => {
      return [message, ...history.slice(0, 7)]
    })
  }

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
  }, [isGm])

  useEffect(() => {
    return OBR.broadcast.onMessage(MESSAGE_CHANNEL_PUBLIC, (event) => {
      try {
        OBR.notification.show(`${event.data}`)
        pushMessageToHistory(event.data)
      } catch (error) {
        console.error(error)
      }
    })
  }, [])

  const rollForRow = async ({ attribute, numDice, modifier }) => {
    let rolls = []
    let wildDieRolls = []
    let wildDieTotal = 0
    let wildDieStatus = "normal"

    // Roll the wild die first
    let currentWildRoll = rollD6()
    wildDieRolls.push(currentWildRoll)

    if (currentWildRoll === 1) {
      wildDieStatus = "fail"
      currentWildRoll = rollD6()
      wildDieRolls.push(-currentWildRoll)
      wildDieTotal -= currentWildRoll
    } else if (currentWildRoll === 6) {
      wildDieStatus = "explode"
      wildDieTotal = currentWildRoll
      currentWildRoll = rollD6()
      while (currentWildRoll === 6) {
        wildDieRolls.push(currentWildRoll)
        wildDieTotal += currentWildRoll
        currentWildRoll = rollD6()
      }
      wildDieRolls.push(currentWildRoll)
      wildDieTotal += currentWildRoll
    } else {
      wildDieTotal = currentWildRoll
    }

    // Roll the regular dice
    for (let i = 0; i < numDice - 1; i++) {
      rolls.push(rollD6())
    }

    // Calculate total
    const regularTotal = rolls.reduce((sum, roll) => sum + roll, 0)
    const total = regularTotal + wildDieTotal + modifier

    const quality = getQualityRating(total)

    const [firstWildDie, ...restWildDie] = wildDieRolls
    const diceString = `${rolls.join("+")}${firstWildDie === 1 ? restWildDie.join("") : "+" + wildDieRolls.join("+")}${modifier ? "+" + modifier : ""}=${total}`

    setResult({
      rolls: {
        regular: rolls,
        wild: wildDieRolls,
      },
      attribute,
      total,
      modifier,
      wildDieStatus,
      quality,
      diceString,
    })

    await OBR.broadcast.sendMessage(
      isPublicRoll ? MESSAGE_CHANNEL_PUBLIC : MESSAGE_CHANNEL_GM,
      `${player.name}s ${attribute} ist ${quality.text} (${diceString}) ${quality.icon}`,
      { destination: "ALL" },
    )
  }

  return (
    <Container>
      <SliderButton
        isOn={isPublicRoll}
        onStateChange={setIsPublicRoll}
        onCaption={"Public Roll"}
        offCaption={"Private Roll"}
      />
      <Table>
        <thead>
          <tr>
            <Th>Fertigkeit</Th>
            <Th>D6</Th>
            <Th>Bonus</Th>
            <Th>Probe</Th>
          </tr>
        </thead>
        <tbody>
          {attributes.map((row, index) => (
            <Row
              key={index}
              row={row}
              updateRow={(newRownumDice) => {
                setAttributes(
                  attributes.map((item, i) => {
                    if (i === index) {
                      return { ...item, ...newRownumDice }
                    }
                    return item
                  }),
                )
              }}
              rollForRow={rollForRow}
            />
          ))}
          <tr>
            <Td></Td>
            <Td></Td>
            <Td></Td>
            <Td></Td>
            <Td>
              <AdjustButton
                onClick={() =>
                  setAttributes((numDices) => [...numDices, { numDice: 1, modifier: 0 }])
                }
              >
                +
              </AdjustButton>
            </Td>
          </tr>
        </tbody>
      </Table>
      {result && (
        <Result>
          <DiceDetail>
            <QualityRating>
              {`${result.attribute} ist ${result.quality.text} (${result.diceString}) ${WILD_DIE_STATUS_TEXT[result.wildDieStatus]} ${result.quality.icon}`}
            </QualityRating>

            <DiceContainer>
              {result.rolls.regular.map((item, index) => (
                <DiceImage key={index} src={`./dice-${Math.abs(item)}.svg`} alt={`dice-${item}`} />
              ))}
              {result.rolls.wild.map((item, index) => (
                <DiceImage
                  key={index}
                  className={result.wildDieStatus}
                  src={`./dice-${Math.abs(item)}.svg`}
                  alt={`dice-${item}`}
                />
              ))}
            </DiceContainer>
          </DiceDetail>
        </Result>
      )}
      <History>
        {history.map((item, index) => (
          <div key={item + index}>{item}</div>
        ))}
      </History>
    </Container>
  )
}

export default Sheet
