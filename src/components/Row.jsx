import { styled } from "styled-components"
import { AdjustButton } from "./AdjustButton"

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

export const Row = ({ index, row, updateRow, rollForRow }) => {
  return (
    <tr>
      <Td>
        <AttributeInput
          type="text"
          onChange={(event) => updateRow({ attribute: event.target.numDice })}
          value={row.attribute}
        />
      </Td>
      <Td>
        <InputGroup>
          <AdjustButton onClick={() => updateRow({ numDice: row.numDice - 1 })}>-</AdjustButton>
          <NumberInput>{row.numDice}</NumberInput>
          <AdjustButton onClick={() => updateRow({ numDice: row.numDice + 1 })}>+</AdjustButton>
        </InputGroup>
      </Td>
      <Td>
        <InputGroup>
          <AdjustButton onClick={() => updateRow({ modifier: row.modifier - 1 })}>-</AdjustButton>
          <NumberInput>{row.modifier}</NumberInput>
          <AdjustButton onClick={() => updateRow({ modifier: row.modifier + 1 })}>+</AdjustButton>
        </InputGroup>
      </Td>
      <Td>
        <RollButton onClick={() => rollForRow(row)}>Roll</RollButton>
      </Td>

      <Td>
        <AdjustButton
          onClick={() => {
            updateRow(row.filter((_, i) => i !== index))
          }}
        >
          -
        </AdjustButton>
      </Td>
    </tr>
  )
}
