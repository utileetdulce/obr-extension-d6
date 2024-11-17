import React from "react"
import { styled } from "styled-components"

import { Row } from "./Row"

const Table = styled.table`
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
`

const Th = styled.th`
  padding: 12px;
  text-align: center;
  border: 1px solid #ddd;
  background-color: #2c3e50;
  color: white;
`

export const Sheet = ({
  player,
  rollForRow,
  attributes,
  setAttributes,
  attributeClasses,
  setAttributeClasses,
}) => {
  return (
    <>
      <h1>{player.name}</h1>

      <Table>
        <thead>
          <tr>
            <Th>Fertigkeit</Th>
            <Th>W6</Th>
            <Th>Bonus</Th>
            <Th>Probe</Th>
            <Th>±</Th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(attributeClasses).map(([key, value]) => (
            <React.Fragment key={key}>
              <Row
                key={key}
                row={value}
                addRow={() => {
                  setAttributes(() => [...attributes, { numDice: 0, modifier: 0, class: key }])
                }}
                updateRow={(row) => {
                  setAttributeClasses({
                    ...attributeClasses,
                    [key]: { ...attributeClasses[key], ...row },
                  })
                }}
                rollForRow={rollForRow}
              />

              {attributes
                .filter((attr) => attr.class === key)
                .map((row, index) => (
                  <Row
                    key={key + index}
                    row={row}
                    attributeClass={value}
                    deleteRow={() => {
                      setAttributes(attributes.filter((attribute) => attribute !== row))
                    }}
                    updateRow={(updatedRow) => {
                      setAttributes(
                        attributes.map((item) => {
                          if (item === row) {
                            return { ...item, ...updatedRow }
                          }
                          return item
                        }),
                      )
                    }}
                    rollForRow={rollForRow}
                  />
                ))}
            </React.Fragment>
          ))}
        </tbody>
      </Table>
    </>
  )
}
