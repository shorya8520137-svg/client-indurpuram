const http = require('http')
const { Server } = require('socket.io')

const server = http.createServer()
const io = new Server(server, {
  cors: {
    origin: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})

io.on('connection', (socket: any) => {
  console.log('Client connected:', socket.id)

  socket.on('join', (room: string) => {
    socket.join(room)
  })

  socket.on('send_message', (data: any) => {
    io.to('admin').emit('receive_message', data)
    io.to(`user_${data.userId}`).emit('receive_message', data)
  })

  socket.on('typing', (data: any) => {
    socket.broadcast.emit('user_typing', data)
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

const PORT = process.env.SOCKET_PORT || 3001
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`)
})
