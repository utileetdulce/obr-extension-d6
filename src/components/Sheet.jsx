import React from "react"
import { styled } from "styled-components"

import { Row } from "./Row"
import { useProbe } from "../hooks/useProbe"

const PlayerName = styled.h1`
  margin: 10px 0;
`

const Table = styled.table`
  width: min-content;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
`

const Th = styled.th`
  padding: 4px;
  text-align: center;
  border: 1px solid #ddd;
  background-color: #2c3e50;
  color: white;
`

export const Sheet = ({
  player,
  box,
  isPublicRoll = true,
  attributes,
  setAttributes,
  attributeClasses,
  setAttributeClasses,
}) => {
  const { rollForRow } = useProbe(isPublicRoll, player, box)

  return (
    <>
      <PlayerName>{player.name}</PlayerName>

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
                name={key}
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
                    name={value}
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
