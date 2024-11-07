import { styled } from "styled-components"

const Td = styled.td`
  padding: 2px;
  text-align: left;
  border: 1px solid #ddd;
`

const Button = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  padding: 4px 8px;
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
  height: 30px;
  width: 30px;
  margin: 0 2px;
  width: 30px;
`

const AttributeInput = styled.input`
  background-color: white;
  color: black;
  border: 1px solid #ddd;
  padding: 4px 8px;
  border-radius: 3px;
  width: 100px;
`

const NumberInput = styled.div`
  color: black;
  width: 20px;
  text-align: center;
`

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`

export const Row = ({ index, attributeValues, setAttributeValues, rollForRow }) => {
  return (
    <tr>
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
          value={attributeValues[index].attribute}
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
          <NumberInput>{attributeValues[index].value}</NumberInput>
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
            -
          </AdjustButton>
          <NumberInput>{attributeValues[index].modifier}</NumberInput>
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
            +
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
        <AdjustButton
          onClick={() => {
            setAttributeValues(attributeValues.filter((_, i) => i !== index))
          }}
        >
          -
        </AdjustButton>
      </Td>
    </tr>
  )
}
