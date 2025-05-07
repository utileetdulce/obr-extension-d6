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
  [INTELLIGENZ]: {
    attribute: INTELLIGENZ,
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
  const player = usePlayer(true)
  const [attributes, setAttributes] = useLocalStorage("initialAttributes", initialAttributes)
  const [attributeClasses, setAttributeClasses] = useLocalStorage(
    "initialAttributeClasses",
    initialAttributeClasses,
  )

  useEffect(() => {
    OBR.player.setMetadata({ attributes, attributeClasses })
  }, [attributes, attributeClasses])

  const saveDataToJsonFile = () => {
    const element = document.createElement("a")
    const file = new Blob(
      [
        JSON.stringify({
          attributes,
          attributeClasses,
          notes: player.notes || "",
        }),
      ],
      {
        type: "application/json",
      },
    )
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

  const restoreDataFromJsonFile = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = JSON.parse(e.target.result)
      setAttributes(data.attributes)
      setAttributeClasses(data.attributeClasses)

      // Update notes if present in the imported data
      if (data.notes !== undefined && player.updatePlayer) {
        player.updatePlayer({ notes: data.notes })
      }
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
    saveDataToJsonFile,
    restoreDataFromJsonFile,
  }
}
