import styled from "styled-components"

const Container = styled.div`
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  color: #000;
`

const Grid = styled.div`
  display: grid;
  gap: 1rem;
`

const Card = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 1rem;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
`

const Th = styled.th`
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
  background-color: #f5f5f5;
`

const Td = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
`

const AttributesTableTd = styled(Td)`
  &:nth-child(2) {
    width: 100px;
  }
`

const SkillsTableTd = styled(Td)`
  &:nth-child(2),
  &:nth-child(3) {
    width: 100px;
  }
`

const CharacterImage = styled.div`
  width: 100px;
  height: 200px;
  border: 1px solid #ccc;
  margin: 10px 0;
`

const OrnamentalBorder = styled.div`
  border: 2px solid #333;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
  background-image: linear-gradient(to right, #f5f5f5, white, #f5f5f5);
`

const DefenseGrid = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  align-items: center;
`

const Input = styled.input`
  width: 60px;
`

const Sheet = () => (
  <Container>
    <Grid>
      <Card>
        <h2>Grundfertigkeit (GF)</h2>
        <Table className="attributes-table">
          <thead>
            <tr>
              <Th>Attribute</Th>
              <Th>Min/Max</Th>
              <Th>Value</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <AttributesTableTd>(R) Reflexe</AttributesTableTd>
              <AttributesTableTd>3W+1</AttributesTableTd>
              <AttributesTableTd>
                <Input type="number" />
              </AttributesTableTd>
            </tr>
            <tr>
              <AttributesTableTd>(K) Koordination</AttributesTableTd>
              <AttributesTableTd>3W+2</AttributesTableTd>
              <AttributesTableTd>
                <Input type="number" />
              </AttributesTableTd>
            </tr>
            <tr>
              <AttributesTableTd>(P) Physis</AttributesTableTd>
              <AttributesTableTd>4W</AttributesTableTd>
              <AttributesTableTd>
                <Input type="number" />
              </AttributesTableTd>
            </tr>
            <tr>
              <AttributesTableTd>(R) Ratio</AttributesTableTd>
              <AttributesTableTd>4W+2</AttributesTableTd>
              <AttributesTableTd>
                <Input type="number" />
              </AttributesTableTd>
            </tr>
            <tr>
              <AttributesTableTd>(A) Auftreten</AttributesTableTd>
              <AttributesTableTd>1W+2</AttributesTableTd>
              <AttributesTableTd>
                <Input type="number" />
              </AttributesTableTd>
            </tr>
            <tr>
              <AttributesTableTd>(W) Wahrnehmung</AttributesTableTd>
              <AttributesTableTd>4W+1</AttributesTableTd>
              <AttributesTableTd>
                <Input type="number" />
              </AttributesTableTd>
            </tr>
            <tr>
              <AttributesTableTd>(P) Paranormal</AttributesTableTd>
              <AttributesTableTd>--</AttributesTableTd>
              <AttributesTableTd>
                <Input type="number" />
              </AttributesTableTd>
            </tr>
          </tbody>
        </Table>
      </Card>

      <Card>
        <h2>Defense</h2>
        <DefenseGrid>
          <label>Passive Verteidigung:</label>
          <Input type="number" value="11" />

          <label>Rüstung Physis:</label>
          <Input type="number" value="7" />

          <label>Grundschaden:</label>
          <Input type="number" value="7" />

          <label>Bewegung [m/Runde]:</label>
          <Input type="number" />
        </DefenseGrid>
      </Card>

      <Card>
        <h2>Skills</h2>
        <Table className="skills-table">
          <thead>
            <tr>
              <Th>Fertigkeit</Th>
              <Th>GF(s)</Th>
              <Th>Wert</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <SkillsTableTd>Schwimmen/Tauchen</SkillsTableTd>
              <SkillsTableTd>KP</SkillsTableTd>
              <SkillsTableTd>
                <Input type="text" value="6W" />
              </SkillsTableTd>
            </tr>
            <tr>
              <SkillsTableTd>Seefahrt/Nautik</SkillsTableTd>
              <SkillsTableTd>RW</SkillsTableTd>
              <SkillsTableTd>
                <Input type="text" value="5W" />
              </SkillsTableTd>
            </tr>
            <tr>
              <SkillsTableTd>Erfinden</SkillsTableTd>
              <SkillsTableTd>R</SkillsTableTd>
              <SkillsTableTd>
                <Input type="text" value="6W" />
              </SkillsTableTd>
            </tr>
          </tbody>
        </Table>
      </Card>

      <Card>
        <h2>Weapons</h2>
        <Table>
          <thead>
            <tr>
              <Th>Waffe</Th>
              <Th>Schaden</Th>
              <Th>Reichweite</Th>
              <Th>Munition</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>Harpune</Td>
              <Td>14</Td>
              <Td>10m</Td>
              <Td>1</Td>
            </tr>
            <tr>
              <Td>Messer</Td>
              <Td>11.5</Td>
              <Td>1m</Td>
              <Td>-</Td>
            </tr>
            <tr>
              <Td>Rapier</Td>
              <Td>16</Td>
              <Td>2m</Td>
              <Td>-</Td>
            </tr>
          </tbody>
        </Table>
      </Card>

      <OrnamentalBorder>
        <h2>Equipment</h2>
        <div style={{ display: "flex", gap: "20px" }}>
          <CharacterImage />
          <div>
            <h3>Ausrüstung (wo getragen)</h3>
            <p>Amulett des großen Geflechts: 2 Brilliante Heilzauber (8W)</p>
          </div>
        </div>
      </OrnamentalBorder>
    </Grid>
  </Container>
)

export default Sheet
