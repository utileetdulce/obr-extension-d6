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
  const [tempModifiers, setTempModifiers] = React.useState({})
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
            <Th>Temp. Mod.</Th>
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
                tempModifier={tempModifiers[key] || 0}
                setTempModifier={(mod) => setTempModifiers({ ...tempModifiers, [key]: mod })}
                rollForRow={(rowData) => {
                  rollForRow({
                    ...rowData,
                    modifier: (rowData.modifier || 0) + (tempModifiers[key] || 0),
                  })
                }}
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
                      if (window.confirm("Are you sure you want to remove this attribute?")) {
                        setAttributes(attributes.filter((attribute) => attribute !== row))
                      }
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
                    tempModifier={tempModifiers[row.attribute] || 0}
                    setTempModifier={(mod) =>
                      setTempModifiers({ ...tempModifiers, [row.attribute]: mod })
                    }
                    rollForRow={(rowData) => {
                      rollForRow({
                        ...rowData,
                        modifier: (rowData.modifier || 0) + (tempModifiers[row.attribute] || 0),
                      })
                    }}
                  />
                ))}
            </React.Fragment>
          ))}
        </tbody>
      </Table>
    </>
  )
}
