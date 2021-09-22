let input = document.getElementById("chat-message");

input.addEventListener("keyup", function(e) {
  // Number 13 is the "Enter" key on the keyboard
  if (e.key === "Enter" && e.target.tagName != 'TEXTAREA') {
    e.preventDefault();
  }
  if (e.keyCode === 13 ) {
    // Trigger the button element with a click
    document.getElementById("send-btn").click();
  }
});

sendMsg = () =>{
  let msg = document.getElementById('chat-message').value;
  if (msg === ""){  return  } 
  send(msg) ;
  socket.emit('send-message', msg) ;
  document.getElementById('chat-message').value =''
}

socket.on('receive-message', (message, userId) =>{
  receive(message,userId);
})

let ul =document.getElementById('messages');

const send =(message) =>{
  let li =document.createElement("li");
  li.className ="message-right";
  li.innerHTML =
  `<div class="message__content">
    <div class="message__text">
      <span>${message}</span>
    </div>
  </div>`
  ul.appendChild(li);
}

const receive =(message, userId) =>{
  let li =document.createElement("li");
  li.className ="message-left";
  li.innerHTML =`<div class="message__avatar">${userId.substr(0,1)}</div>
  <div class="message__content">
    <span>${userId.substr(0,6)}</span>
    <div class="message__text">
      <span>${message}</span>
    </div>
  </div>`
  ul.appendChild(li);
}



// joined / leave ser 
const joinedLeftUser = (userId, join = false) => {
  const date = new Date();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const format = hours >= 12 ? "PM" : "AM";
  hours %= 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  
  let ul = document.getElementById("messages");
  let li = document.createElement("li");
  li.className = "system-message";
  li.innerHTML = `<span>${hours}:${minutes}${format}</span><span>${userId.substr(0,6)} has ${
      join ? "joined" : "left"
  } the meeting</span>`;
  ul.appendChild(li);
  // lists.append(list);
  // container.scrollTop = container.scrollHeight;
};

//send fles


