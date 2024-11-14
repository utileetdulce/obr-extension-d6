import React, { useState } from "react"
import { styled } from "styled-components"

import { SliderButton } from "./SliderButton"
import { Row } from "./Row"
import { rollD6, getQualityRating } from "../utils"
import OBR from "@owlbear-rodeo/sdk"
import { usePlayer } from "../hooks/usePlayer"
import { useMessageSubscription } from "../hooks/useMessageSubscription"
import { MESSAGE_CHANNEL_PUBLIC, MESSAGE_CHANNEL_GM } from "../constants"
import { MessageHistory } from "./MessageHistory"
import { RollResult } from "./RollResult"

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

const initialAttributes = [
  { attribute: "Akrobatik", numDice: 2, modifier: 0, class: "physis" },
  { attribute: "Klingenkampf", numDice: 2, modifier: 0, class: "reflexe" },
  { attribute: "Schusswaffen", numDice: 2, modifier: 0, class: "koordination" },
  { attribute: "Reiten", numDice: 2, modifier: 0, class: "koordination" },
  { attribute: "Alchemie", numDice: 2, modifier: 0, class: "ratio" },
  { attribute: "Umgarnen", numDice: 2, modifier: 0, class: "auftreten" },
  { attribute: "Lügen erkennen", numDice: 2, modifier: 0, class: "wahrnehmung" },
]

const initialAttributeClasses = {
  physis: {
    attribute: "Physis",
    numDice: 2,
    modifier: 0,
  },
  reflexe: {
    attribute: "Reflexe",
    numDice: 2,
    modifier: 0,
  },
  koordination: {
    attribute: "Koordination",
    numDice: 2,
    modifier: 0,
  },
  ratio: {
    attribute: "Ratio",
    numDice: 2,
    modifier: 0,
  },
  auftreten: {
    attribute: "Auftreten",
    numDice: 2,
    modifier: 0,
  },
  wahrnehmung: {
    attribute: "Wahrnehmung",
    numDice: 2,
    modifier: 0,
  },
}

export const Sheet = () => {
  const [result, setResult] = useState(null)
  const player = usePlayer()
  const [isPublicRoll, setIsPublicRoll] = useState(true)
  const [attributes, setAttributes] = useState(initialAttributes)
  const [attributeClasses, setAttributeClasses] = useState(initialAttributeClasses)
  const { history } = useMessageSubscription()

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
            <Th>W6</Th>
            <Th>Bonus</Th>
            <Th>Probe</Th>
            <Th>+</Th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(attributeClasses).map(([key, value]) => (
            <React.Fragment key={key}>
              <Row
                key={key}
                row={value}
                addRow={() => {
                  setAttributes(() => [...attributes, { numDice: 0, modifier: 0, class: key }])
                }}
                updateRow={(row) => {
                  setAttributeClasses({
                    ...attributeClasses,
                    [key]: { ...attributeClasses[key], ...row },
                  })
                }}
                rollForRow={rollForRow}
              />

              {attributes
                .filter((attr) => attr.class === key)
                .map((row, index) => (
                  <Row
                    key={key + index}
                    row={row}
                    attributeClass={value}
                    deleteRow={() => {
                      setAttributes(attributes.filter((attribute) => attribute !== row))
                    }}
                    updateRow={(updatedRow) => {
                      setAttributes(
                        attributes.map((item) => {
                          if (item === row) {
                            return { ...item, ...updatedRow }
                          }
                          return item
                        }),
                      )
                    }}
                    rollForRow={rollForRow}
                  />
                ))}
            </React.Fragment>
          ))}
        </tbody>
      </Table>
      <RollResult result={result} />
      <MessageHistory history={history} />
    </Container>
  )
}
