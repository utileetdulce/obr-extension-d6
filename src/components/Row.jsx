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
  background-color: ${(props) => (props.isClass ? "rgb(222,222,222)" : "white")};
  border: ${(props) => (props.isClass ? "none" : "1px solid #ddd")};
  outline: ${(props) => (props.isClass ? "none" : "inherit")};
  font-weight: ${(props) => (props.isClass ? "bold" : "normal")};
  color: black;
  padding: 4px 8px;
  border-radius: 3px;
  width: 100px;
  box-sizing: border-box;

  &:focus {
    border: ${(props) => (props.isClass ? "none" : "1px solid #008")};
  }
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

export const Row = ({ deleteRow, attributeClass, row, updateRow, rollForRow }) => {
  const isClass = row.class === undefined
  const numDice = (attributeClass?.numDice || 0) + row.numDice
  const modifier = (attributeClass?.modifier || 0) + row.modifier

  return (
    <>
      <tr
        style={{
          background: isClass ? "rgb(222,222,222)" : "white",
          fontWeight: isClass ? "bold" : "normal",
        }}
      >
        <Td>
          <AttributeInput
            isClass={isClass}
            type="text"
            readOnly={isClass}
            onChange={(e) => updateRow({ attribute: e.target.value })}
            value={row.attribute || ""}
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
          <RollButton
            onClick={() => rollForRow({ ...row, numDice, modifier })}
          >{`${numDice}W+${modifier}`}</RollButton>
        </Td>

        <Td>{!isClass && <AdjustButton onClick={deleteRow}>-</AdjustButton>}</Td>
      </tr>
    </>
  )
}
