import { styled } from "styled-components"
import { AdjustButton } from "./AdjustButton"
import { ArrowDownRightSvg } from "./ArrowDownRightSvg"

const Tr = styled.tr`
  background: ${(props) => (props.$isClass ? "rgb(222,222,222)" : "white")};
  font-weight: ${(props) => (props.$isClass ? "bold" : "normal")};
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
  outline: 2px solid ${(props) => (props.$isClass ? "#3498db" : "#333")};
  border-radius: 50%;
  color: ${(props) => (props.$isClass ? "#3498db" : "black")};
  width: 20px;
  height: 20px;
  font-weight: ${(props) => (props.$isClass ? "bold" : "normal")};

  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`

const NumberInputDice = styled(NumberInput)`
  border-radius: 3px;
`

const Sign = styled.span`
  width: 12px;
  text-align: center;
`

const InputGroup = styled.div`
  position: relative;
  left: ${(props) => (props.$isClass ? "0px" : "0px")};
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
      <Tr $isClass={isClass}>
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
            {!isClass && (
              <>
                <NumberInputDice $isClass={true}>{attributeClass?.numDice}</NumberInputDice>
                <Sign>{Math.sign(row.numDice) === -1 ? "-" : "+"} </Sign>
              </>
            )}

            <NumberInputDice $isClass={isClass}>{Math.abs(row.numDice)}</NumberInputDice>
            <AdjustButton onClick={() => updateRow({ numDice: row.numDice + 1 })}>+</AdjustButton>
          </InputGroup>
        </Td>
        <Td>
          <InputGroup>
            <AdjustButton $decrease onClick={() => updateRow({ modifier: row.modifier - 1 })}>
              -
            </AdjustButton>
            {!isClass && (
              <>
                <NumberInput $isClass={true}>{attributeClass?.modifier}</NumberInput>
                <Sign>{Math.sign(row.modifier) === -1 ? "-" : "+"} </Sign>
              </>
            )}
            <NumberInput $isClass={isClass}>{Math.abs(row.modifier)}</NumberInput>
            <AdjustButton onClick={() => updateRow({ modifier: row.modifier + 1 })}>+</AdjustButton>
          </InputGroup>
        </Td>
        <Td>
          <RollButton onClick={() => rollForRow({ ...row, numDice, modifier })}>
            {`${numDice}W`}
            {Math.sign(modifier) === -1 ? "-" : "+"}
            {Math.abs(modifier)}
          </RollButton>
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
      </Tr>
    </>
  )
}
