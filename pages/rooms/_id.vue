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
      <button class="button wrapper-icons"
              @click="startTimer"
              :disabled="(Number(minute) * 60 + Number(second)) <= 0 || timerIsRunning"
      >
        <fa :icon="faPlay" />
      </button>
      <button class="button wrapper-icons"
              @click="stopTimer"
              :disabled="!timerIsRunning"
      >
        <fa :icon="faPause" />
      </button>
      <button class="button wrapper-icons"
              @click="resetTimer"
              :disabled="!timerIsResetable || timerIsRunning"
      >
        <fa :icon="faUndo" />
      </button>
    </div>
    <div class="mb-5">
      <button class="button wrapper-icons"
              @click="copyUrl"
      >
        <fa :icon="faUserPlus" class="mr-1" />
        <span>Invite members</span>
      </button>
    </div>
    <div>
      <nuxt-link class="button wrapper-icons" to="/">
        <fa :icon="faHome" />
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client'
import Push from 'push.js'
import { faPlay, faPause, faUndo, faUserPlus, faHome } from '@fortawesome/free-solid-svg-icons'

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
      timerIsResetable: false
    }
  },

  head () {
    return {
      title: `${("00" + Number(this.minute)).slice(-2)}:${("00" + Number(this.second)).slice(-2)} | TeamTimer`
    }
  },

  computed: {
    faPlay()      { return faPlay },
    faPause()     { return faPause },
    faUndo()      { return faUndo },
    faUserPlus()  { return faUserPlus },
    faHome()      { return faHome }
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

    // ウィンドウを閉じたときにルームから立ち去る
    window.onbeforeunload = () => {
      this.socket.close()
    }

    // ルームに参加
    this.socket.emit('join-the-room', this.$route.params.id)
    
    // プッシュ許可を取る
    Push.Permission.request()
  },

  beforeRouteLeave(to, from, next) {
    this.socket.close()
    next()
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
  @media screen and (max-width: 375px)  {
    font-size: 3rem;
  }
  @media screen and (min-width: 376px) {
    font-size: 5rem;
  }
  font-weight: bold;
  display: inline-block;
  box-shadow: inset 3px 3px 5px darken($primary, 25%),
              inset -3px -3px 5px lighten($primary, 25%);

  input {
    width: 100px!important;
    &::-webkit-inner-spin-button, &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
      -moz-appearance:textfield;
    }
  }
}
</style>