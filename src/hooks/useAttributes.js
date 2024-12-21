import OBR from "@owlbear-rodeo/sdk"
import { useEffect } from "react"
import { useLocalStorage } from "@uidotdev/usehooks"
import { usePlayer } from "./usePlayer"

const STAERKE = "Stärke"
const GESCHICKLICHKEIT = "Geschicklichkeit"
const ROBUSTHEIT = "Kondition"
const AUFTRETEN = "Auftreten"
const WAHRNEHMUNG = "Wahrnehmung"
const INTELLIGENZ = "Intelligenz"

const initialAttributes = [
  { attribute: "Waffenloser Kampf (S)", numDice: 0, modifier: 0, class: STAERKE },
  { attribute: "Bewaffneter Kampf (S)", numDice: 0, modifier: 0, class: STAERKE },
  { attribute: "Schild (S)", numDice: 0, modifier: 0, class: STAERKE },
  { attribute: "Athletik", numDice: 0, modifier: 0, class: STAERKE },

  { attribute: "Waffenloser Kampf (G)", numDice: 0, modifier: 0, class: GESCHICKLICHKEIT },
  { attribute: "Bewaffneter Kampf (G)", numDice: 0, modifier: 0, class: GESCHICKLICHKEIT },
  { attribute: "Schild (G)", numDice: 0, modifier: 0, class: GESCHICKLICHKEIT },
  { attribute: "Akrobatik", numDice: 0, modifier: 0, class: GESCHICKLICHKEIT },
  { attribute: "Fernwaffen", numDice: 0, modifier: 0, class: GESCHICKLICHKEIT },
  { attribute: "Ausweichen", numDice: 0, modifier: 0, class: GESCHICKLICHKEIT },

  { attribute: "Ausdauer", numDice: 0, modifier: 0, class: ROBUSTHEIT },
  { attribute: "Resistenz", numDice: 0, modifier: 0, class: ROBUSTHEIT },
  { attribute: "Willensstärke", numDice: 0, modifier: 0, class: ROBUSTHEIT },

  { attribute: "Medizin", numDice: 0, modifier: 0, class: INTELLIGENZ },
  { attribute: "Navigation", numDice: 0, modifier: 0, class: INTELLIGENZ },
  { attribute: "Handwerkskunst", numDice: 0, modifier: 0, class: INTELLIGENZ },
  { attribute: "Wissen", numDice: 0, modifier: 0, class: INTELLIGENZ },
  { attribute: "Naturkunde", numDice: 0, modifier: 0, class: INTELLIGENZ },

  { attribute: "Verkleiden", numDice: 0, modifier: 0, class: WAHRNEHMUNG },
  { attribute: "Schleichen", numDice: 0, modifier: 0, class: WAHRNEHMUNG },
  { attribute: "Untersuchen", numDice: 0, modifier: 0, class: WAHRNEHMUNG },
  { attribute: "Spuren suchen", numDice: 0, modifier: 0, class: WAHRNEHMUNG },

  { attribute: "Diebeskunst", numDice: 0, modifier: 0, class: AUFTRETEN },
  { attribute: "Tierhandhabung", numDice: 0, modifier: 0, class: AUFTRETEN },
  { attribute: "Beeinflussen", numDice: 0, modifier: 0, class: AUFTRETEN },
  { attribute: "Schauspielern", numDice: 0, modifier: 0, class: AUFTRETEN },
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
  [ROBUSTHEIT]: {
    attribute: ROBUSTHEIT,
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
  [INTELLIGENZ]: {
    attribute: INTELLIGENZ,
    numDice: 2,
    modifier: 0,
  },
}

export const useAttributes = () => {
  const player = usePlayer(true)
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

    const now = new Date()
    const formattedDateTime = [
      now.toLocaleDateString("de-DE"),
      now.toLocaleTimeString("de-DE"),
    ].join("-")

    element.download = `${player.name}-${formattedDateTime}.json`
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

  const resetAttributes = () => {
    setAttributes(initialAttributes)
    setAttributeClasses(initialAttributeClasses)
  }

  return {
    attributeClasses,
    attributes,
    setAttributeClasses,
    setAttributes,
    resetAttributes,
    saveAttibutesToJsonFile,
    restoreAttributesFromJsonFile,
  }
}
