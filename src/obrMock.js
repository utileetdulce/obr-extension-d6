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
    show: (msg) => {
      console.log(msg)
      const toast = document.createElement("div")
      toast.innerHTML = msg
      toast.style.position = "absolute"
      toast.style.top = "10px"
      toast.style.left = "50%"
      toast.style.transform = "translateX(-50%)"
      toast.style.padding = "10px"
      toast.style.backgroundColor = "black"
      toast.style.color = "white"
      document.body.appendChild(toast)
      setTimeout(() => {
        document.body.removeChild(toast)
      }, 2000)
    },
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
