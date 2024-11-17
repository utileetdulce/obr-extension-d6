import { styled } from "styled-components"
import { AdjustButton } from "./AdjustButton"
import { ArrowDownRightSvg } from "./ArrowDownRightSvg"

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
  background-color: ${(props) => (props.$isClass ? "rgb(222,222,222)" : "white")};
  border: ${(props) => (props.$isClass ? "none" : "1px solid #ddd")};
  outline: ${(props) => (props.$isClass ? "none" : "inherit")};
  font-weight: ${(props) => (props.$isClass ? "bold" : "normal")};
  color: black;
  padding: 4px 8px;
  border-radius: 3px;
  width: 130px;
  box-sizing: border-box;

  &:focus {
    border: ${(props) => (props.$isClass ? "none" : "1px solid #008")};
  }
`

const NumberInput = styled.div`
  outline: 2px solid #333;
  border-radius: 50%;
  color: black;
  width: 20px;
  height: 20px;
  margin-left: 3px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`

const NumberInputDice = styled(NumberInput)`
  border-radius: 3px;
`

const InputGroup = styled.div`
  position: relative;
  left: ${(props) => (props.$isClass ? "-5px" : "0px")};
  display: flex;
  align-items: center;
  gap: 2px;

  & ${AdjustButton} {
    opacity: 0;
  }
  &:hover ${AdjustButton} {
    opacity: 1;
  }
`

export const Row = ({ addRow, deleteRow, attributeClass, row, updateRow, rollForRow }) => {
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
            $isClass={isClass}
            type="text"
            readOnly={isClass}
            onChange={(e) => updateRow({ attribute: e.target.value })}
            value={row.attribute || ""}
          />
        </Td>
        <Td>
          <InputGroup $isClass={isClass}>
            <AdjustButton $decrease onClick={() => updateRow({ numDice: row.numDice - 1 })}>
              -
            </AdjustButton>
            {!isClass && <ArrowDownRightSvg />}
            {isClass ? "" : "+"}
            <NumberInputDice>{row.numDice}</NumberInputDice>
            <AdjustButton onClick={() => updateRow({ numDice: row.numDice + 1 })}>+</AdjustButton>
          </InputGroup>
        </Td>
        <Td>
          <InputGroup>
            <AdjustButton $decrease onClick={() => updateRow({ modifier: row.modifier - 1 })}>
              -
            </AdjustButton>
            {!isClass && <ArrowDownRightSvg />}
            {isClass ? "" : "+"}
            <NumberInput>{row.modifier}</NumberInput>
            <AdjustButton onClick={() => updateRow({ modifier: row.modifier + 1 })}>+</AdjustButton>
          </InputGroup>
        </Td>
        <Td>
          <RollButton
            onClick={() => rollForRow({ ...row, numDice, modifier })}
          >{`${numDice}W+${modifier}`}</RollButton>
        </Td>

        <Td>
          <InputGroup>
            {isClass ? (
              <AdjustButton onClick={addRow}>+</AdjustButton>
            ) : (
              <AdjustButton $decrease onClick={deleteRow}>
                -
              </AdjustButton>
            )}
          </InputGroup>
        </Td>
      </tr>
    </>
  )
}
