<template>
  <div>
    <h1 class="my-10">TEAM TIMER</h1>
    <button @click="createRoom">create a room</button>
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

button {
  font-size: 1.2rem;
  padding: 1rem 2rem;
  background: $back;
  border-width: 0;
  border-radius: 3rem;
  box-shadow: 3px 3px 5px darken($back, 50%), -3px -3px 5px lighten($back, 50%);

  &:active {
    box-shadow: inset 3px 3px 5px darken($back, 50%), inset -3px -3px 5px lighten($back, 50%);
  }
}
</style>
