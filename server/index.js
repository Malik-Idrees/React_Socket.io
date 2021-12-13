import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { Server, Socket } from 'socket.io'

const app = express()
app.use(cors('*'))

const httpServer = createServer(app)

const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
})

io.on('connection', (socket) => {
    console.log('socket:', socket.id)

    socket.on('get_rooms', () => {
        const activeRooms = () => {
            var activeRooms = []
            ;[...io.sockets.adapter.rooms.keys()].forEach((room) => {
                var isRoom = true
                ;[...io.sockets.adapter.sids.keys()].forEach((id) => {
                    isRoom = id === room ? false : isRoom
                })
                if (isRoom) activeRooms.push(room)
            })
            return activeRooms
        }

        io.sockets.emit('rooms', activeRooms())
    })

    socket.on('join_room', (data) => {
        socket.join(data)
        console.log(`User with ID: ${socket.id} joined room: ${data}`)
    })

    socket.on('create_room', (data) => {
        socket.join(data)
        console.log(`User with ID: ${socket.id} Created room: ${data}`)
    })

    socket.on('send_message', (data) => {
        socket.to(data.room).emit('receive_message', data)
    })

    socket.on('disconnect', () => {
        console.log('User Disconnected:', socket.id)
    })
})
const PORT = process.env.PORT || 3001
httpServer.listen(PORT, console.log('Server is running'))
