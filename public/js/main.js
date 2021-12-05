const chatForm = document.querySelector('#chat-form')
const chatMessage = document.querySelector('.chat-messages')
const roomName = document.querySelector('#room-name')
const userList = document.querySelector('#users')


//Get username
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})
console.log(username, room);

const socket = io()
// join chatroom
socket.emit('joinRoom', {username, room})

// Get room, users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users)
})
 
//msg from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message)

    //auto scroll
    chatMessage.scrollTop = chatMessage.scrollHeight

   
})

chatForm.addEventListener('submit', e => {
    e.preventDefault();

    const msg = e.target.elements.msg.value

    socket.emit('chatMessage', msg);

    e.target.elements.msg.value = '';
    e.target.elements.msg.focus()
})

//ouput message to DOM
function outputMessage(message){
    const div = document.createElement('div');
    let result = message.text
        .replaceAll(':D',' &#128512;')
        .replaceAll(':*',' &#128536;')
        .replaceAll(':)',' &#128578;')
        .replaceAll(':(',' &#128577;')
        .replaceAll(':|',' &#128528;')
        .replaceAll('8)',' &#128526;')

        div.innerHTML = `<p class="meta">${message.username} ' ' <span>${message.time}</span></p>
        <p class="text">
            ${result}
        </p>`;
    
 
    div.classList.add('message');
    document.querySelector('.chat-messages').appendChild(div)
}
//room name to DOM
function outputRoomName(room){
    roomName.innerText = room;
}

// users
function outputUsers(users){
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}
