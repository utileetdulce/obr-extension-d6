import OBR from "@owlbear-rodeo/sdk"
import { useEffect, useState } from "react"
import { usePlayer } from "./usePlayer"

const initialAttributes = [
  { attribute: "Akrobatik", numDice: 2, modifier: 0, class: "physis" },
  { attribute: "Klingenkampf", numDice: 2, modifier: 0, class: "reflexe" },
  { attribute: "Schusswaffen", numDice: 2, modifier: 0, class: "koordination" },
  { attribute: "Reiten", numDice: 2, modifier: 0, class: "koordination" },
  { attribute: "Alchemie", numDice: 2, modifier: 0, class: "ratio" },
  { attribute: "Umgarnen", numDice: 2, modifier: 0, class: "auftreten" },
  { attribute: "Lügen erkennen", numDice: 2, modifier: 0, class: "wahrnehmung" },
]

const initialAttributeClasses = {
  physis: {
    attribute: "Physis",
    numDice: 2,
    modifier: 0,
  },
  reflexe: {
    attribute: "Reflexe",
    numDice: 2,
    modifier: 0,
  },
  koordination: {
    attribute: "Koordination",
    numDice: 2,
    modifier: 0,
  },
  ratio: {
    attribute: "Ratio",
    numDice: 2,
    modifier: 0,
  },
  auftreten: {
    attribute: "Auftreten",
    numDice: 2,
    modifier: 0,
  },
  wahrnehmung: {
    attribute: "Wahrnehmung",
    numDice: 2,
    modifier: 0,
  },
}

export const useAttributes = () => {
  const [attributes, setAttributes] = useState(initialAttributes)
  const [attributeClasses, setAttributeClasses] = useState(initialAttributeClasses)
  const player = usePlayer()

  useEffect(() => {
    OBR.player.setMetadata({ attributes, attributeClasses })
  }, [attributes, attributeClasses, player])

  return {
    attributeClasses,
    attributes,
    setAttributeClasses,
    setAttributes,
  }
}
