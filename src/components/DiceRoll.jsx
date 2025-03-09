import styled from "styled-components"

const Container = styled.div`
  position: absolute;
  top: 60px;
  left: 0;
  opacity: 1;
  z-index: 1;
  height: 100%;
  width: 100%;
  width: 512px;
  height: 700px;
  pointer-events: none;
`

export const DiceRoll = ({ diceBoxRef }) => {
  return (
    <>
      <Container id={"dice-box-container"} ref={diceBoxRef}></Container>
    </>
  )
}
