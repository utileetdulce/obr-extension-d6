import OBR from "@owlbear-rodeo/sdk"

let mockSubscriptions = []

const urlParams = new URLSearchParams(window.location.search)
const playerName = urlParams.get("player") || "Peter"
const role = urlParams.get("role") || "GM"
const player = {
  metadata: {},
}

export const mockObr = () => {
  OBR.party = {
    getPlayers: () => {
      return new Promise((resolve) => {
        resolve([player])
      })
    },
  }
  OBR.player = {
    getName: () => {
      return new Promise((resolve) => {
        resolve(playerName)
      })
    },
    setMetadata: (metadata) => {
      return new Promise((resolve) => {
        player.metadata = { ...player.metadata, ...metadata }
        resolve()
      })
    },
    getRole: () => {
      return new Promise((resolve) => {
        resolve(role)
      })
    },
    onChange: (callback) => {
      console.log("Listening for player changes")
      return () => {
        console.log("Unsubscribed from player changes")
      }
    },
  }
  OBR.notification = {
    show: (msg) => console.log(msg),
  }
  OBR.broadcast = {
    onMessage: (channel, callback) => {
      console.log(`Listening for messages on channel ${channel}`)
      mockSubscriptions.push({ channel, callback })
      return () => {
        console.log(`Unsubscribed from channel ${channel}`)
        mockSubscriptions = mockSubscriptions.filter((sub) => sub.channel !== channel)
      }
    },
    sendMessage: (channel, message) => {
      console.log(`Sending message: ${message}`)
      mockSubscriptions.forEach((sub) => {
        if (sub.channel === channel) {
          sub.callback({ data: message })
        }
      })
    },
  }
}
