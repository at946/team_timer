<template>
  <div>
    <h1 class="my-10">TEAM TIMER</h1>
    <button class="button button-create-room wrapper-material-icons" @click="createRoom">
      <span class="material-icons mr-1">room</span>create a room
    </button>
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
    this.socket.on('reply-for-create-a-room', (room_id) => {
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

<style lang="scss" scoped>
@import '@/assets/css/_color.scss';

h1 {
  font-weight: bold;
  font-size: 5rem;
}

.button-create-room {
  font-size: 1.2rem;
}
</style>
