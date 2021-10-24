let input = document.getElementById("chat-message");
let ul =document.getElementById('messages');

input.addEventListener("keyup",(event)=> {
  event.preventDefault();
  if (event.keyCode === 13) {
    sendMsg()
    input.value ="" ;
  }
});

//chatbox.js 
sendMsg = () =>{
  let message = document.getElementById('chat-message').value;
  if (message.replace(/\s/g, '').length != 0   ){  
    let li =document.createElement("li");
    li.className ="message-right";
    li.innerHTML =
    `<div class="message__content">
      <div class="message__text"><span>${message}</span> </div>
    </div>`
    ul.appendChild(li);
    socket.emit('send-message', message) ;
  } 
}

//chatbox.js 
socket.on('receive-message', (message, userId) =>{
  let li =document.createElement("li");
  li.className ="message-left";
  li.innerHTML =`<div class="message__avatar">${userId.substr(0,1)}</div>
  <div class="message__content">
    <span>${userId.substr(0,6)}</span>
    <div class="message__text"><span>${message}</span></div>
  </div>`
  ul.appendChild(li);
})



// joined / leave ser 
const joinedLeftMsg = (userId, join = false) => {
  const date = new Date();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const format = hours >= 12 ? "PM" : "AM";
  hours %= 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  
  let li = document.createElement("li");
  li.className = "system-message";
  li.innerHTML = `<span>${hours}:${minutes}${format}</span><span>${userId.substr(0,6)} has ${
      join ? "joined" : "left"
  } the meeting</span>`;
  ul.appendChild(li);
};

//send files


