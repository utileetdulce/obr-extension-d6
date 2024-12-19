import styled from "styled-components"
import { useAttributes } from "../hooks/useAttributes"

const Button = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  width: 230px;

  margin: 2px 0;

  &:hover {
    background-color: #2980b9;
  }
`

export function ManageSheetData() {
  const { saveAttibutesToJsonFile, restoreAttributesFromJsonFile, resetAttributes } =
    useAttributes()

  return (
    <>
      <Button onClick={saveAttibutesToJsonFile}> 💾 Save Attributes to file</Button>
      <Button as="label" htmlFor="files">
        ↺ Restore attributes from file
      </Button>
      <Button onClick={resetAttributes}>↺ Reset attributes to initial values</Button>
      <input
        id="files"
        style={{ visibility: "hidden" }}
        type="file"
        onChange={(e) => {
          restoreAttributesFromJsonFile(e.target.files[0])
          e.target.value = ""
        }}
      />
    </>
  )
}
