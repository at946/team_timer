<template>
  <div>
    <div class="timer">
      <input  type="number"
              v-model="minute"
              placeholder="mm"
              min="0"
              max="60"
              :readonly="timerIsRunning"
              @blur="focusOutInput"
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
    <button @click="startTimer"
            :disabled="(Number(minute) * 60 + Number(second)) <= 0 || timerIsRunning"
    >START</button>
    <button @click="stopTimer"
            :disabled="!timerIsRunning"
    >STOP</button>
    <button @click="resetTimer"
            :disabled="timerIsRunning"
    >RESET</button>
    <button @click="copyUrl">COPY URL</button>
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
      minute: '',
      second: '',
      setMinute: '',
      setSecond: '',
      timerIsRunning: false,
    }
  },

  head () {
    return {
      title: `${("00" + this.minute).slice(-2)}:${("00" + this.second).slice(-2)} | TeamTimer`
    }
  },

  mounted () {
    // join-the-roomのレスポンスを受け取る
    this.socket.on('reply-for-join-the-room', (res) => {
      if (res.admission) {
        this.amFacilitator = res.isFacilitator
      } else {
        this.$router.push("/")
      }
    })

    // タイマー設定の更新を受け取る
    this.socket.on('set-timer', (res) => {
      this.minute = Math.floor(res.time / 60)
      this.second = res.time % 60
    })

    // ルームに参加
    this.socket.emit('join-the-room', this.$route.params.id)
  },

  methods: {
    focusOutInput() {
      var time = Number(this.minute) * 60 + Number(this.second)
      this.socket.emit('set-timer', { room_id: this.$route.params.id, time: time })
    },

    checkTimerValidation() {
      var timerSecond = Number(this.minute) * 60 + Number(this.second)

      // タイマーが0以下の場合、タイマーは0分0秒に設定されること
      if (timerSecond <= 0) { timerSecond = 0 }
      // タイマーが60分より大きい場合、タイマーは60分に設定されること
      if (timerSecond > 3600) { timerSecond = 3600 }

      this.minute = Math.floor(timerSecond / 60)
      this.second = timerSecond % 60
    },

    startTimer() {
      this.checkTimerValidation()
      if (this.minute == 0 && this.second == 0) { return }
      this.setMinute = this.minute
      this.setSecond = this.second
      const alermDate = new Date()
      alermDate.setMinutes(alermDate.getMinutes() + this.minute)
      alermDate.setSeconds(alermDate.getSeconds() + this.second)
      this.timerIsRunning = true

      this.timer = setInterval(() => {
        const presentDate = new Date()
        const diffTime = Math.round((alermDate - presentDate) / 1000)
        this.minute = Math.floor( diffTime / 60 )
        this.second = diffTime % 60
        if (diffTime < 1) {
          this.stopTimer()
          Push.create("Time is up!!", {
            onClick: function () {
              window.focus()
              this.close()
            }
          })
        }
      }, 1000)
    },

    stopTimer() {
      clearInterval(this.timer)
      this.timerIsRunning = false
    },

    resetTimer() {
      this.minute = this.setMinute
      this.second = this.setSecond
    },

    copyUrl() {
      this.$copyText(window.location.origin + this.$route.fullPath)
      alert("URLをクリップボードにコピーしました。\nチームメンバーに共有しましょう！")
    }

  }
}
</script>