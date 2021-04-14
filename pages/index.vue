<template>
  <div>
    <h1>Team Timer</h1>
    <button @click="createRoom">ルームをつくる</button>
  </div>
</template>

<script>
import io from 'socket.io-client'

export default {
  data () {
    return {
      socket: io()
    }
  },

  mounted () {
    this.socket.on('guide-to-the-room', (room_id) => {
      this.$router.push(`/rooms/${room_id}`)
    })
  },

  methods: {
    createRoom() {
      this.socket.emit('create-a-room')
    }
  }
}
</script>

<style>
</style>
