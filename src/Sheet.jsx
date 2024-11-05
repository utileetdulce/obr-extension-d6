import { useEffect, useState } from "react"
import { styled } from "styled-components"
import OBR from "@owlbear-rodeo/sdk"

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
  text-align: left;
  border: 1px solid #ddd;
  background-color: #2c3e50;
  color: white;
`

const Td = styled.td`
  padding: 2px;
  text-align: left;
  border: 1px solid #ddd;
`

const Button = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #2980b9;
  }
`

const RollButton = styled(Button)`
  width: 60px;
  padding: 4px 8px;
`

const AdjustButton = styled(Button)`
  padding: 4px 8px;
  margin: 0 2px;
  width: 30px;
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

const AttributeInput = styled.input`
  background-color: white;
  color: black;
  border: 1px solid #ddd;
  padding: 4px 8px;
  border-radius: 3px;
  width: 100px;
`

const NumberInput = styled.input`
  background-color: white;
  color: black;
  width: 30px;
  padding: 0;
  box-sizing: border-box;
  text-align: center;
  padding-top: 2px;
  margin: 0 2px;
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`

const History = styled.div`
  margin-top: 20px;
  padding: 10px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
`

const initialAttributes = [
  { attribute: "Reflexe", value: 2, modifier: 0, isPublic: true },
  { attribute: "Koordination", value: 2, modifier: 0, isPublic: true },
  { attribute: "Physis", value: 2, modifier: 0, isPublic: true },
  { attribute: "Ratio", value: 2, modifier: 0, isPublic: true },
  { attribute: "Auftreten", value: 2, modifier: 0, isPublic: true },
  { attribute: "Wahrnehmung", value: 2, modifier: 0, isPublic: true },
  { value: 2, modifier: 0, isPublic: true },
  { value: 2, modifier: 0, isPublic: true },
  { value: 2, modifier: 0, isPublic: true },
]

const Sheet = () => {
  const [result, setResult] = useState(null)
  const [isGm, setIsGm] = useState(false)
  const [history, setHistory] = useState([])
  const [attributeValues, setAttributeValues] = useState(initialAttributes)

  const pushMessageToHistory = (message) => {
    setHistory((history) => {
      return [message, ...history.slice(0, 7)]
    })
  }

  useEffect(() => {
    OBR.player.getRole().then((role) => setIsGm(role === "GM"))
  }, [])

  useEffect(() => {
    if (OBR.isReady && isGm) {
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
    if (OBR.isReady) {
      return OBR.broadcast.onMessage(MESSAGE_CHANNEL_PUBLIC, (event) => {
        console.log(event.data)
        try {
          OBR.notification.show(`${event.data}`)
          pushMessageToHistory(event.data)
        } catch (error) {
          console.error(error)
        }
      })
    }
  }, [])

  const rollForRow = async (attribute, numDice, modifier, isPublic) => {
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

    const playerName = await OBR.player.getName()
    await OBR.broadcast.sendMessage(
      isPublic ? MESSAGE_CHANNEL_PUBLIC : MESSAGE_CHANNEL_GM,
      `${playerName}s ${attribute} ist ${quality.text} (${diceString}) ${quality.icon}`,
      { destination: "ALL" },
    )
  }

  return (
    <Container>
      <Table>
        <thead>
          <tr>
            <Th>Fertigkeit</Th>
            <Th>Würfel (D6)</Th>
            <Th>Bonus/Malus</Th>
            <Th>Probe</Th>
            <Th>Public</Th>
          </tr>
        </thead>
        <tbody>
          {attributeValues.map((row, index) => (
            <tr key={index}>
              <Td>
                <AttributeInput
                  type="text"
                  onChange={(event) =>
                    setAttributeValues(
                      attributeValues.map((item, i) => {
                        if (i === index) {
                          return { ...item, attribute: event.target.value }
                        }
                        return item
                      }),
                    )
                  }
                  placeholder={row.attribute}
                />
              </Td>
              <Td>
                <InputGroup>
                  <AdjustButton
                    onClick={() => {
                      setAttributeValues(
                        attributeValues.map((item, i) => {
                          if (i === index) {
                            return { ...item, value: item.value - 1 }
                          }
                          return item
                        }),
                      )
                    }}
                  >
                    -
                  </AdjustButton>
                  <NumberInput type="number" value={attributeValues[index].value} readOnly />
                  <AdjustButton
                    onClick={() => {
                      setAttributeValues(
                        attributeValues.map((item, i) => {
                          if (i === index) {
                            return { ...item, value: item.value + 1 }
                          }
                          return item
                        }),
                      )
                    }}
                  >
                    +
                  </AdjustButton>
                </InputGroup>
              </Td>
              <Td>
                <InputGroup>
                  <AdjustButton
                    onClick={() => {
                      setAttributeValues(
                        attributeValues.map((item, i) => {
                          if (i === index) {
                            return { ...item, modifier: item.modifier - 1 }
                          }
                          return item
                        }),
                      )
                    }}
                  >
                    {" "}
                    -{" "}
                  </AdjustButton>
                  <NumberInput type="number" value={attributeValues[index].modifier} readOnly />
                  <AdjustButton
                    onClick={() => {
                      setAttributeValues(
                        attributeValues.map((item, i) => {
                          if (i === index) {
                            return { ...item, modifier: item.modifier + 1 }
                          }
                          return item
                        }),
                      )
                    }}
                  >
                    {" "}
                    +{" "}
                  </AdjustButton>
                </InputGroup>
              </Td>
              <Td>
                <RollButton
                  onClick={() =>
                    rollForRow(
                      attributeValues[index].attribute,
                      attributeValues[index].value,
                      attributeValues[index].modifier,
                      attributeValues[index].isPublic,
                    )
                  }
                >
                  Roll
                </RollButton>
              </Td>
              <Td>
                <input
                  type="checkbox"
                  checked={attributeValues[index].isPublic}
                  onChange={(event) => {
                    setAttributeValues(
                      attributeValues.map((item, i) => {
                        if (i === index) {
                          return { ...item, isPublic: event.target.checked }
                        }
                        return item
                      }),
                    )
                  }}
                />
              </Td>
              <Td>
                <Button
                  onClick={() => {
                    setAttributeValues(attributeValues.filter((_, i) => i !== index))
                  }}
                >
                  -{" "}
                </Button>
              </Td>
            </tr>
          ))}
          <tr>
            <Td></Td>
            <Td></Td>
            <Td></Td>
            <Td></Td>
            <Td></Td>
            <Td>
              <Button onClick={() => setAttributeValues((values) => [...values, {}])}>+ </Button>
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

function rollD6() {
  return Math.floor(Math.random() * 6) + 1
}

function getQualityRating(total) {
  if (total <= 5) return { text: "ungeschickt", class: "quality-bad", icon: "🔴🔴" }
  if (total <= 10) return { text: "durchschnittlich", class: "quality-average", icon: "🔴🟠" }
  if (total <= 15) return { text: "geschickt", class: "quality-ok", icon: "🟠🟠" }
  if (total <= 20) return { text: "gut", class: "quality-good", icon: "🟢🟠" }
  if (total <= 25) return { text: "meisterlich", class: "quality-master", icon: "🟢🟢" }
  if (total <= 30) return { text: "brilliant", class: "quality-brilliant", icon: "🟢🟢🟢" }
  return { text: "göttlich", class: "quality-god", icon: "🟢🟢🟢🟢" }
}

export default Sheet
