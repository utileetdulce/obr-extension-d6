import styled from "styled-components"

const SliderContainer = styled.div`
  width: 60px;
  height: 30px;
  background-color: ${(props) => (props.isOn ? "#8c8" : "#c88")};
  border-radius: 15px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Slider = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  position: absolute;
  left: ${(props) => (props.isOn ? "30px" : "0px")};
  padding: 5px;
  box-sizing: border-box;
  transition: all 0.3s;
`

const Handle = styled.div`
  width: 20px;
  height: 20px;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.3s;
`

const Caption = styled.div`
  position: absolute;
  left: 70px;
  font-size: 14px;
  white-space: nowrap;
  color: ${(props) => (props.isOn ? "#6a6" : "#a66")};
`

export const SliderButton = ({ isOn, onStateChange, onCaption = "On", offCaption = "Off" }) => {
  const toggleState = () => {
    if (onStateChange) {
      onStateChange(!isOn)
    }
  }

  return (
    <SliderContainer isOn={isOn} onClick={toggleState}>
      <Caption isOn={isOn}>{isOn ? onCaption : offCaption}</Caption>
      <Slider isOn={isOn}>
        <Handle />
      </Slider>
    </SliderContainer>
  )
}
