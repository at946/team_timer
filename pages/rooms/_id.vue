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
    {{ time }}
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
      minute: null,
      second: null,
      time: null,
      resetTime: null,
      setMinute: '',
      setSecond: '',
      timerIsRunning: false,
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
        if (res.time) {
          this.time = res.time
          this.calcMinSecFromTime()
        }
      } else {
        this.$router.push("/")
      }
    })

    // タイマー設定の更新を受け取る
    this.socket.on('set-timer', (res) => { 
      this.time = res.time
      this.calcMinSecFromTime()
    })

    // ルームに参加
    this.socket.emit('join-the-room', this.$route.params.id)
  },

  methods: {
    // 秒から分秒を計算する
    calcMinSecFromTime() {
      this.minute = Math.floor(this.time / 60)
      this.second = this.time % 60
    },

    // 分秒から秒を計算する
    calcTimeFromMinSec() {
      this.time = this.minute * 60 + this.second
    },

    // タイマーからフォーカスアウトしたら、設定の更新をソケットに送る
    focusOutInput() {
      this.checkTimerValidation()
      this.socket.emit('set-timer', { room_id: this.$route.params.id, time: this.time })
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
      this.checkTimerValidation()

      if (this.time <= 0) { return }

      // リセット用にtimeの履歴を残す
      this.resetTime = this.time

      const alermDate = new Date()
      alermDate.setSeconds(alermDate.getSeconds() + this.time)
      this.timerIsRunning = true

      this.timer = setInterval(() => {
        const presentDate = new Date()
        this.time = Math.round((alermDate - presentDate) / 1000)
        this.calcMinSecFromTime()
        if (this.time < 1) {
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
      this.time = this.resetTime
      this.calcMinSecFromTime()
      this.socket.emit('set-timer', { room_id: this.$route.params.id, time: this.time })
    },

    copyUrl() {
      this.$copyText(window.location.origin + this.$route.fullPath)
      alert("URLをクリップボードにコピーしました。\nチームメンバーに共有しましょう！")
    }

  }
}
</script>