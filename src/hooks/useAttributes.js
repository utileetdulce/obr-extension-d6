import OBR from "@owlbear-rodeo/sdk"
import { useEffect } from "react"
import { useLocalStorage } from "@uidotdev/usehooks"

const initialAttributes = [
  { attribute: "waffenloser Kampf (S)", numDice: 0, modifier: 0, class: "physis" },
  { attribute: "bewaffneter Kampf (S)", numDice: 0, modifier: 0, class: "physis" },
  { attribute: "Schild (S)", numDice: 0, modifier: 0, class: "physis" },
  { attribute: "Athletik", numDice: 0, modifier: 0, class: "physis" },

  { attribute: "waffenloser Kampf (G)", numDice: 0, modifier: 0, class: "reflexe" },
  { attribute: "bewaffneter Kampf (G)", numDice: 0, modifier: 0, class: "reflexe" },
  { attribute: "Schild (G)", numDice: 0, modifier: 0, class: "reflexe" },
  { attribute: "Akrobatik", numDice: 0, modifier: 0, class: "reflexe" },
  { attribute: "Fernwaffe/Werfen", numDice: 0, modifier: 0, class: "reflexe" },
  { attribute: "Ausweichen", numDice: 0, modifier: 0, class: "reflexe" },

  { attribute: "Ausdauer/Zähgkeit", numDice: 0, modifier: 0, class: "kondition" },
  {
    attribute: "Resistenz (Krankheit, Gifte, Verletzungen)",
    numDice: 0,
    modifier: 0,
    class: "kondition",
  },
  { attribute: "Willensstärke", numDice: 0, modifier: 0, class: "kondition" },

  { attribute: "Medizin/erte Hlfe", numDice: 0, modifier: 0, class: "ratio" },
  { attribute: "Navigation", numDice: 0, modifier: 0, class: "ratio" },
  { attribute: "Handerks-/Ingenieurskunst", numDice: 0, modifier: 0, class: "ratio" },
  { attribute: "Wissen/Recherche", numDice: 0, modifier: 0, class: "ratio" },
  { attribute: "Naturkunde", numDice: 0, modifier: 0, class: "ratio" },

  { attribute: "Verkleiden", numDice: 0, modifier: 0, class: "wahrnehmung" },
  { attribute: "Untersuchen", numDice: 0, modifier: 0, class: "wahrnehmung" },
  { attribute: "Spuren lesen", numDice: 0, modifier: 0, class: "wahrnehmung" },
  { attribute: "Schleichen", numDice: 0, modifier: 0, class: "wahrnehmung" },

  { attribute: "Tierhandhabung", numDice: 0, modifier: 0, class: "auftreten" },
  { attribute: "Betören/Beeinflussen/Befehlen", numDice: 0, modifier: 0, class: "auftreten" },
  { attribute: "Schauspielern/Täuschen", numDice: 0, modifier: 0, class: "auftreten" },
  { attribute: "Diebeskunst", numDice: 0, modifier: 0, class: "auftreten" },
]

const initialAttributeClasses = {
  physis: {
    attribute: "Stärke",
    numDice: 2,
    modifier: 0,
  },
  reflexe: {
    attribute: "Geschicklichkeit",
    numDice: 2,
    modifier: 0,
  },
  kondition: {
    attribute: "Kondition",
    numDice: 2,
    modifier: 0,
  },
  ratio: {
    attribute: "Intelligenz",
    numDice: 2,
    modifier: 0,
  },
  wahrnehmung: {
    attribute: "Wahrnehmung",
    numDice: 2,
    modifier: 0,
  },
  auftreten: {
    attribute: "Auftreten",
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
