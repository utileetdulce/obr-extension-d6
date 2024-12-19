import OBR from "@owlbear-rodeo/sdk"
import { useEffect } from "react"
import { useLocalStorage } from "@uidotdev/usehooks"

const STAERKE = "Stärke"
const GESCHICKLICHKEIT = "Geschicklichkeit"
const KONDITION = "Kondition"
const AUFTRETEN = "Auftreten"
const WAHRNEHMUNG = "Wahrnehmung"
const INTELLIGENZ = "Intelligenz"

const initialAttributes = [
  { attribute: "Waffenloser Kampf (S)", numDice: 0, modifier: 0, class: STAERKE },
  { attribute: "Bewaffneter Nahkampf (S)", numDice: 0, modifier: 0, class: STAERKE },
  { attribute: "Schild (S)", numDice: 0, modifier: 0, class: STAERKE },
  { attribute: "Athletik", numDice: 0, modifier: 0, class: STAERKE },
  { attribute: "Waffenloser Kampf (G)", numDice: 0, modifier: 0, class: GESCHICKLICHKEIT },
  { attribute: "Bewaffneter Nahkampf (G)", numDice: 0, modifier: 0, class: GESCHICKLICHKEIT },
  { attribute: "Schild (G)", numDice: 0, modifier: 0, class: GESCHICKLICHKEIT },
  { attribute: "Akrobatik", numDice: 0, modifier: 0, class: GESCHICKLICHKEIT },
  { attribute: "Diebeskunst", numDice: 0, modifier: 0, class: GESCHICKLICHKEIT },
  { attribute: "Fernwaffen / Werfen", numDice: 0, modifier: 0, class: GESCHICKLICHKEIT },
  { attribute: "Ausweichen", numDice: 0, modifier: 0, class: GESCHICKLICHKEIT },
  { attribute: "Schleichen", numDice: 0, modifier: 0, class: GESCHICKLICHKEIT },
  { attribute: "Ausdauer / Zähigkeit", numDice: 0, modifier: 0, class: KONDITION },
  { attribute: "Resistenz", numDice: 0, modifier: 0, class: KONDITION },
  { attribute: "Medizin / erst Hilfe", numDice: 0, modifier: 0, class: INTELLIGENZ },
  { attribute: "Navigation", numDice: 0, modifier: 0, class: INTELLIGENZ },
  { attribute: "Handwerks- / Ingenieurskunst", numDice: 0, modifier: 0, class: INTELLIGENZ },
  { attribute: "Recherche / Wissen", numDice: 0, modifier: 0, class: INTELLIGENZ },
  { attribute: "Naturkunde", numDice: 0, modifier: 0, class: INTELLIGENZ },
  { attribute: "Verkleiden", numDice: 0, modifier: 0, class: WAHRNEHMUNG },
  { attribute: "Untersuchen", numDice: 0, modifier: 0, class: WAHRNEHMUNG },
  { attribute: "Spuren lesen / Suchen", numDice: 0, modifier: 0, class: WAHRNEHMUNG },
  { attribute: "Tierhandhabung", numDice: 0, modifier: 0, class: AUFTRETEN },
  { attribute: "Betören / Beeinflussen / Befehlen", numDice: 0, modifier: 0, class: AUFTRETEN },
  { attribute: "Schauspielern", numDice: 0, modifier: 0, class: AUFTRETEN },
  { attribute: "Willensstärke", numDice: 0, modifier: 0, class: AUFTRETEN },
]

const initialAttributeClasses = {
  [STAERKE]: {
    attribute: STAERKE,
    numDice: 2,
    modifier: 0,
  },
  [GESCHICKLICHKEIT]: {
    attribute: GESCHICKLICHKEIT,
    numDice: 2,
    modifier: 0,
  },
  [KONDITION]: {
    attribute: KONDITION,
    numDice: 2,
    modifier: 0,
  },
  [AUFTRETEN]: {
    attribute: AUFTRETEN,
    numDice: 2,
    modifier: 0,
  },
  [WAHRNEHMUNG]: {
    attribute: WAHRNEHMUNG,
    numDice: 2,
    modifier: 0,
  },
}

export const useAttributes = () => {
  const [attributes, setAttributes] = useLocalStorage("initialAttributes", initialAttributes)
  const [attributeClasses, setAttributeClasses] = useLocalStorage(
    "initialAttributeClasses",
    initialAttributeClasses,
  )

  useEffect(() => {
    OBR.player.setMetadata({ attributes, attributeClasses })
  }, [attributes, attributeClasses])

  const saveAttibutesToJsonFile = () => {
    const element = document.createElement("a")
    const file = new Blob([JSON.stringify({ attributes, attributeClasses })], {
      type: "application/json",
    })
    element.href = URL.createObjectURL(file)
    element.download = "attributes.json"
    document.body.appendChild(element)
    element.click()
  }

  const restoreAttributesFromJsonFile = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const { attributes, attributeClasses } = JSON.parse(e.target.result)
      setAttributes(attributes)
      setAttributeClasses(attributeClasses)
    }
    reader.readAsText(file)
  }

  return {
    attributeClasses,
    attributes,
    setAttributeClasses,
    setAttributes,
    saveAttibutesToJsonFile,
    restoreAttributesFromJsonFile,
  }
}
