<template>
  <div>
    <div class="timer mt-10 mb-5 px-4 py-2">
      <input  type="number"
              v-model="minute"
              placeholder="mm"
              min="0"
              max="60"
              :readonly="timerIsRunning"
              @blur="focusOutInput"
              autofocus
      >
      <span>:</span>
      <input  type="number"
              v-model="second"
              placeholder="ss"
              min="0"
              max="59"
              :readonly="timerIsRunning"
              @blur="focusOutInput"
      >
    </div>
    <div class="mb-4">
      <button class="button wrapper-icons mx-1"
              @click="startTimer"
              :disabled="(Number(minute) * 60 + Number(second)) <= 0 || timerIsRunning"
      >
        <span class="material-icons">play_arrow</span>
      </button>
      <button class="button wrapper-icons mx-1"
              @click="stopTimer"
              :disabled="!timerIsRunning"
      >
        <span class="material-icons">pause</span>
      </button>
      <button class="button wrapper-icons mx-1"
              @click="resetTimer"
              :disabled="!timerIsResetable || timerIsRunning"
      >
        <span class="material-icons">replay</span>
      </button>
    </div>
    <div class="mb-5">
      <button class="button wrapper-icons"
              @click="copyUrl"
      >
        <span class="material-icons mr-1">group_add</span>Invite members
      </button>
    </div>
    <div>
      <nuxt-link class="button wrapper-icons" to="/">
        <span class="material-icons">home</span>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client'
import Push from 'push.js'

export default {
  data () {
    return {
      socket: io(),
      timer: null,
      minute: '00',
      second: '00',
      time: null,
      resetTime: null,
      setMinute: '',
      setSecond: '',
      timerIsRunning: false,
      timerIsResetable: false
    }
  },

  head () {
    return {
      title: `${("00" + Number(this.minute)).slice(-2)}:${("00" + Number(this.second)).slice(-2)} | TeamTimer`
    }
  },

  mounted () {
    // join-the-roomのレスポンスを受け取る
    this.socket.on('reply-for-join-the-room', (res) => {
      if (res.admission) {
        this.timerIsResetable = res.timerIsResetable
      } else {
        this.$router.push("/")
      }
    })

    // タイマー設定の更新を受け取る
    this.socket.on('set-timer', (res) => { 
      this.time = res.time
      this.calcMinSecFromTime()
    })

    // タイマーの開始を受け取る
    this.socket.on('start-timer', () => {
      this.timerIsRunning = true
      this.timerIsResetable = true
    })

    // タイマーの停止を受け取る
    this.socket.on('stop-timer', () => {
      this.timerIsRunning = false
    })

    // タイマーの終了を受け取る
    this.socket.on('finish-timer', () => {
      this.timerIsRunning = false
      Push.create("Time is up!!", {
        onClick: function () {
          window.focus()
          this.close()
        }
      })
    })

    // ルームに参加
    this.socket.emit('join-the-room', this.$route.params.id)
  },

  methods: {
    // 秒から分秒を計算する
    calcMinSecFromTime() {
      this.minute = ("00" + Math.floor(this.time / 60)).slice(-2)
      this.second = ("00" + this.time % 60).slice(-2)
    },

    // 分秒から秒を計算する
    calcTimeFromMinSec() {
      this.time = this.minute * 60 + this.second
    },

    // タイマーからフォーカスアウトしたら、設定の更新をソケットに送る
    focusOutInput() {
      this.checkTimerValidation()
      this.socket.emit('update-timer', { room_id: this.$route.params.id, time: this.time })
    },

    checkTimerValidation() {
      this.minute = Number(this.minute)
      this.second = Number(this.second)
      this.calcTimeFromMinSec()

      // タイマーが0以下の場合、タイマーは0分0秒に設定されること
      if (this.time <= 0) { this.time = 0 }
      // タイマーが60分より大きい場合、タイマーは60分に設定されること
      if (this.time > 3600) { this.time = 3600 }

      this.calcMinSecFromTime()
    },

    startTimer() {
      this.socket.emit('start-timer', {room_id: this.$route.params.id})
    },

    stopTimer() {
      this.socket.emit('stop-timer', { room_id: this.$route.params.id })
    },

    resetTimer() {
      this.socket.emit('reset-timer', { room_id: this.$route.params.id })
    },

    copyUrl() {
      this.$copyText(window.location.origin + this.$route.fullPath)
      alert("URLをコピーしました。チームメンバーに共有して、この部屋に招待しましょう！\nThe URL has been copied. Share it with your team members and invite them to this room!")
    }

  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/_color.scss';

.timer {
  font-size: 5rem;
  font-weight: bold;
  display: inline-block;
  box-shadow: inset 3px 3px 5px darken($primary, 25%),
              inset -3px -3px 5px lighten($primary, 25%);

  input { 
    &::-webkit-inner-spin-button, &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
      -moz-appearance:textfield;
    }
  }
}
</style>