export function rollD6() {
  return Math.floor(Math.random() * 6) + 1
}

export function rollD6Dices(numDice) {
  return Array.from({ length: numDice }, () => rollD6())
}

export function getQualityRating(total) {
  if (total <= 5) return { text: "ungeschickt", class: "quality-bad", icon: "🔴🔴" }
  if (total <= 10) return { text: "durchschnittlich", class: "quality-average", icon: "🔴🟠" }
  if (total <= 15) return { text: "geschickt", class: "quality-ok", icon: "🟠🟠" }
  if (total <= 20) return { text: "gut", class: "quality-good", icon: "🟢🟠" }
  if (total <= 25) return { text: "meisterlich", class: "quality-master", icon: "🟢🟢" }
  if (total <= 30) return { text: "brilliant", class: "quality-brilliant", icon: "🟢🟢🟢" }
  return { text: "göttlich", class: "quality-god", icon: "🟢🟢🟢🟢" }
}
