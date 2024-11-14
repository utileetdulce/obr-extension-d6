import { styled } from "styled-components"

export const Button = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
`

export const AdjustButton = styled(Button)`
  height: 20px;
  width: 20px;
  border-radius: 50%;

  padding: 0;
  margin: 0 2px;
  background-color: ${(props) => (props.$decrease ? "oklch(.6 .1 360)" : "oklch(.6 .1 150)")};
  border: 1px solid #888;
`
