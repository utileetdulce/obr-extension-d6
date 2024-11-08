import { styled } from "styled-components"

export const Button = styled.button`
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

export const AdjustButton = styled(Button)`
  height: 20px;
  width: 20px;
  padding: 0;
  margin: 0 2px;
`
