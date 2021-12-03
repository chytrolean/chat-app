const http = require('http')
const socketio = require('socket.io')
const express = require('express')
const formatMessage = require('./utils/messages')
const {
    userJoin, 
    getCurrentUser, 
    userLeave, 
    getRoomUsers 
} = require('./utils/users')




const app = express()
const port = process.env.PORT || 3000
const server = http.createServer(app)
const io = socketio(server)

app.use(express.static('public'))

const botName = 'Chat Bot'

io.on('connection', socket => {
    socket.on('joinRoom', ({username, room}) =>{
        const user = userJoin(socket.id,username,room);
        
        socket.join(user.room)

        //welcome
        socket.emit('message', formatMessage(botName,'Welcome to Chat App'))

        //připojení
        socket.broadcast
        .to(user.room)
        .emit('message',
         formatMessage(botName,`${user.username} has joined the chat`))
    
         io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    });

    //listen for chat messages
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id)
        io.to(user.room).emit('message',formatMessage(user.username, msg)
        );


    })

    //Runs when clients disconnects
    socket.on('disconnect',() => {
        const user = userLeave(socket.id)

        if(user){
            io.to(user.room)
            .emit('message', 
             formatMessage(botName, `${user.username} has left.`)
             );

             io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }
    });


})

server.listen(port)