<template>
  <div>
    <h1 class="my-10">Our Timer</h1>
    <button class="button button-create-room wrapper-icons" @click="createRoom">
      <fa :icon="faHourglassStart" class="mr-1" />
      <span>create a room</span>
    </button>
  </div>
</template>

<script>
import io from 'socket.io-client'
import { faHourglassStart } from '@fortawesome/free-solid-svg-icons'

export default {
  data () {
    return {
      socket: io()
    }
  },

  computed: {
    faHourglassStart() { return faHourglassStart }
  },

  mounted () {
    this.socket.on('reply-for-create-a-room', (room_id) => {
      this.$router.push(`/rooms/${room_id}`)
    })

    // ウィンドウを閉じたときにルームから立ち去る
    window.onbeforeunload = () => {
      this.socket.close()
    }
  },

  beforeRouteLeave(to, from, next) {
    this.socket.close()
    next()
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
  font-size: 5rem;
}

.button-create-room {
  font-size: 1.2rem;
}
</style>
