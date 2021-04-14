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

  io.on('connection', (socket) => {    
    // ルームの作成
    socket.on('create-a-room', () => {
      const room_id = Math.floor( Math.random() * 100000000 )
      io.to(socket.id).emit('guide-to-the-room', room_id)
    })
  })
}

start()
