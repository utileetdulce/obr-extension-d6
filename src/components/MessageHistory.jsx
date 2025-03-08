import { styled } from "styled-components"

const History = styled.div`
  margin-top: 20px;
  margin-bottom: 10px;
  padding: 10px;
  height: 200px;
  overflow-y: scroll;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
`

const NumberInput = styled.div`
  border: 2px solid ${({ $borderColor = "#333" }) => $borderColor};
  border-radius: 10px;
  margin-right: 1px;
  color: black;
  font-size: 12px;
  font-weight: normal;
  overflow: none;

  background-color: ${(props) => (props.color ? props.color : "white")};

  box-sizing: border-box;
  width: 20px;
  height: 20px;

  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`

const NumberInputDice = styled(NumberInput)`
  border-radius: 3px;
`

const Item = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 5px;
`

const Block = styled.div`
  display: flex;
  gap: 1px;
`

const Roll = styled.div`
  display: flex;
  width: max-content;
`

const RED = "#FF9999"
const GREEN = "#99CC99"

const Messsage = styled.div`
  margin-right: 10px;
`

export const MessageHistory = ({ history }) => {
  return (
    <History>
      {history.map((item, index) => (
        <Item key={item.message + index}>
          <Messsage>{item.message}</Messsage>

          <Roll>
            {item.result.regularRolls.map((roll, index) => (
              <Block key={index}>
                {index !== 0 ? (roll < 0 ? "-" : "+") : ""}
                <NumberInputDice
                  $borderColor={
                    index === 0 ? (roll === 1 ? RED : roll === 6 ? GREEN : "#333") : "#333"
                  }
                  color={roll < 0 ? RED : "white"}
                  key={index}
                >
                  <b>{Math.abs(roll)}</b>
                </NumberInputDice>
              </Block>
            ))}
            {item.result.wildDieRolls.map((roll, index) => (
              <Block key={index}>
                {roll < 0 ? "-" : "+"}
                <NumberInputDice
                  color={
                    item.result.regularRolls[0] === 6
                      ? GREEN
                      : item.result.regularRolls[0] === 1
                        ? RED
                        : "white"
                  }
                  key={index}
                >
                  <b>{Math.abs(roll)}</b>
                </NumberInputDice>
              </Block>
            ))}
            {item.result.modifier !== 0 && (
              <Block key={index}>
                {Math.sign(item.result.modifier).toString() === "-1" ? "-" : "+"}
                <NumberInput key={index}>
                  <b>{Math.abs(item.result.modifier)}</b>
                </NumberInput>
              </Block>
            )}
            ={item.result.total}
          </Roll>
        </Item>
      ))}
    </History>
  )
}
