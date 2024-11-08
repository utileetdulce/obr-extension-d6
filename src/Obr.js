import OBR from "@owlbear-rodeo/sdk"

let mockSubscriptions = []

const urlParams = new URLSearchParams(window.location.search)
const playerName = urlParams.get("player") || "Peter"
const role = urlParams.get("role") || "GM"

export const mockObr = () => {
  OBR.player = {
    getName: () => {
      return new Promise((resolve) => {
        resolve(playerName)
      })
    },
    getRole: () => {
      return new Promise((resolve) => {
        resolve(role)
      })
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
      console.log(`Sending message to channel ${channel}: ${message}`)
      mockSubscriptions.forEach((sub) => {
        if (sub.channel === channel) {
          sub.callback({ data: message })
        }
      })
    },
  }
}
