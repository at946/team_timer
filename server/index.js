const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const socket = require('socket.io')

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'

async function start () {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  await nuxt.ready()
  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  const server = app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })

  startSocket(server)
}

startSocket = (server) => {
  const io = socket(server)
  const rooms = [/*id, time, timerIsRunning*/]

  io.on('connection', (socket) => {    
    // ルームの作成
    socket.on('create-a-room', () => {
      const room_id = String(Math.floor( Math.random() * 100000000 ))
      rooms.push({
        id: room_id
      })
      io.to(socket.id).emit('reply-for-create-a-room', room_id)
    })

    // ルームへの参加
    socket.on('join-the-room', (room_id) => {
      const room = rooms.find((room) => room.id == room_id)
      if (room) {
        socket.join(room_id)
        io.to(socket.id).emit('reply-for-join-the-room', { admission: true })
        if (room.time) { io.to(socket.id).emit('set-timer', { time: room.time }) }
      } else {
        io.to(socket.id).emit('reply-for-join-the-room', { admission: false })
      }
    })

    // タイマー設定の更新
    socket.on('update-timer', (req) => {
      const room = rooms.find((room) => room.id == req.room_id)
      if (room) {
        room.time = req.time
        io.in(room.id).emit('set-timer', { time: room.time })  
      }
    })

    // タイマーの開始
    socket.on('start-timer', (req) => {
      const room = rooms.find((room) => room.id == req.room_id)
      if (room) {
        const timer = setInterval(() => {
          room.time -= 1
          io.in(room.id).emit('set-timer', {time: room.time })
          if (room.time < 1) {
            clearInterval(timer)
            io.in(room.id).emit('finish-timer')
          }
        }, 1000)
      }
    })

  })
}

start()
