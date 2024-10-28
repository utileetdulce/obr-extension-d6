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

  &.quality-bad {
    background-color: #ffebee;
    color: #c62828;
  }

  &.quality-ok {
    background-color: #fff3e0;
    color: #ef6c00;
  }

  &.quality-good {
    background-color: #e8f5e9;
    color: #2e7d32;
  }

  &.quality-great {
    background-color: #e3f2fd;
    color: #1565c0;
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

const attributes = [
  { attribute: "Strength", value: 2, modifier: 0 },
  { attribute: "Agility", value: 2, modifier: 0 },
  { attribute: "Vigor", value: 2, modifier: 0 },
  { attribute: "Smarts", value: 2, modifier: 0 },
  { attribute: "Spirit", value: 2, modifier: 0 },
]

const Sheet = () => {
  const [result, setResult] = useState(null)
  const [attributeValues, setAttributeValues] = useState(attributes)

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
    if (total <= 5) return { text: "Bad", class: "quality-bad" }
    if (total <= 12) return { text: "OK", class: "quality-ok" }
    if (total <= 18) return { text: "Good", class: "quality-good" }
    return { text: "Great", class: "quality-great" }
  }

  return (
    <Container>
      <Title>Character Sheet</Title>
      <Table>
        <thead>
          <tr>
            <Th>Attribute</Th>
            <Th>Value (D6)</Th>
            <Th>Modifier</Th>
            <Th>Probe</Th>
          </tr>
        </thead>
        <tbody>
          {attributes.map((row, index) => (
            <tr key={index}>
              <Td>
                <AttributeInput type="text" defaultValue={row.attribute} />
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
                      row.attribute,
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
          <h3>{result.attribute} Check</h3>
          <h2>Total: {result.total}</h2>
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
            <StatusMessage color={"#e74c3c"}>
              Critical failure! Wild die rolls were subtracted.
            </StatusMessage>
          )}
          {result.wildDieStatus === "explode" && (
            <StatusMessage color={"#27ae60"}>Wild die exploded!</StatusMessage>
          )}
          <QualityRating className={result.quality.class}>
            Quality Rating: {result.quality.text}
          </QualityRating>
        </Result>
      )}
    </Container>
  )
}

function rollD6() {
  return Math.floor(Math.random() * 6) + 1
}

export default Sheet
