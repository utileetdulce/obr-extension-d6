import { styled } from "styled-components"

import { WILD_DIE_STATUS_TEXT } from "../constants"

const Result = styled.div`
  height: 80px;
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

export const RollResult = ({ result }) => {
  return (
    <>
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
    </>
  )
}
