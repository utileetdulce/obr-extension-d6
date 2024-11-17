import { styled } from "styled-components"

const History = styled.div`
  margin-top: 20px;
  margin-bottom: 10px;
  padding: 10px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
`

export const MessageHistory = ({ history }) => {
  return (
    <History>
      {history.map((item, index) => (
        <div key={item + index}>{item}</div>
      ))}
    </History>
  )
}
