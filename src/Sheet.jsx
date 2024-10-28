import { useState } from "react"
import { styled } from "styled-components"
import OBR from "@owlbear-rodeo/sdk"

const Container = styled.div`
  width: 450px;
  height: 670px;
  font-family: "Arial", sans-serif;
  padding: 20px;
  background-color: #f5f5f5;
`

const Title = styled.h1`
  color: #2c3e50;
  text-align: center;
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
  height: 300px;
  color: black;
  margin-top: 20px;
  padding: 15px;
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

  &.quality-bad {
    background-color: #ff0000;
  }

  &.quality-average {
    background-color: #ff4000;
  }

  &.quality-ok {
    background-color: #ff8000;
  }

  &.quality-good {
    background-color: #ffbf00;
  }

  &.quality-master {
    background-color: #bfff00;
  }

  &.quality-brilliant {
    background-color: #80ff00;
  }

  &.quality-god {
    background-color: #40ff00;
  }
`

const AttributeInput = styled.input`
  border: 1px solid #ddd;
  padding: 4px 8px;
  border-radius: 3px;
  width: 100px;
`

const NumberInput = styled.input`
  width: 30px;
  padding: 0;
  box-sizing: border-box;
  text-align: center;
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

const StatusMessage = styled.div`
  color: ${(props) => props.color};
  margin-top: 8px;
  font-style: italic;
`

const initialAttributes = [
  { attribute: "Strength", value: 2, modifier: 0 },
  { attribute: "Agility", value: 2, modifier: 0 },
  { attribute: "Vigor", value: 2, modifier: 0 },
  { attribute: "Smarts", value: 2, modifier: 0 },
  { attribute: "Spirit", value: 2, modifier: 0 },
]

const Sheet = () => {
  const [result, setResult] = useState(null)
  const [attributeValues, setAttributeValues] = useState(initialAttributes)

  const rollForRow = (attribute, numDice, modifier) => {
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
    })
    OBR.notification.show(`Player XY rolled ${total} for ${attribute}`)
  }

  const getQualityRating = (total) => {
    if (total <= 5) return { text: "Ungeschickt", class: "quality-bad" }
    if (total <= 10) return { text: "Durchschnittlich", class: "quality-average" }
    if (total <= 15) return { text: "Geschickt", class: "quality-ok" }
    if (total <= 20) return { text: "Gut", class: "quality-good" }
    if (total <= 25) return { text: "Meisterlich", class: "quality-master" }
    if (total <= 30) return { text: "Brilliant", class: "quality-brilliant" }
    return { text: "Göttlich", class: "quality-god" }
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
          </tr>
        </thead>
        <tbody>
          {initialAttributes.map((row, index) => (
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
                  defaultValue={row.attribute}
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
                    )
                  }
                >
                  Roll
                </RollButton>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
      {result && (
        <Result>
          {console.log(result)}
          <h3>{result.attribute} Probe</h3>
          <h2>Ergebnis: {result.total}</h2>
          <DiceDetail>
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
          {result.wildDieStatus === "fail" && (
            <StatusMessage color={"#e74c3c"}>Patzer!</StatusMessage>
          )}
          {result.wildDieStatus === "explode" && (
            <StatusMessage color={"#27ae60"}>Kritische Treffer!</StatusMessage>
          )}
          <QualityRating className={result.quality.class}>{result.quality.text}</QualityRating>
        </Result>
      )}
    </Container>
  )
}

function rollD6() {
  return Math.floor(Math.random() * 6) + 1
}

export default Sheet
