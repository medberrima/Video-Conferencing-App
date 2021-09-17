const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;

console.log("salem") ;

const peer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: '443'
});

let myVideoStream;
const users = {};
var myID = "";
const peers = {}

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  myVideoStream = stream;
  addVideoStream(myVideo, stream)

  peer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')

    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })

  socket.on('user-connected', userId => {
    connectToNewUser(userId, stream);
    console.log('user coonected ', userId)
    joinedUserNotif(userId);
    joinedLeftUser(userId, true);
  })
  socket.emit("participants");
})

// joined user
const joinedUserNotif=(userId)=>{
  document.getElementById('notification').style.display="block " ;
  document.getElementById('notification').innerHTML=`<h4> <span> ${userId.substr(0,6)} </span>  has joined the meeting</h4>`
  setTimeout( () => {
    document.getElementById('notification').style.display="none "
  }, 3000);
}

// leave user
const leaveUserNotif=(userId)=>{
  document.getElementById('notification').style.display="block " ;
  document.getElementById('notification').innerHTML=`<h4> <span> ${userId.substr(0,6)} </span>  has left the meeting </h4>`
  setTimeout( () => {
    document.getElementById('notification').style.display="none "
  }, 3000);
}

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close();
  leaveUserNotif(userId)
  joinedLeftUser(userId);
})

peer.on('open', id => {
  console.log(`peer: user join to room ${id} `);
  socket.emit('join-room', ROOM_ID, id);
  myID = id;
})

const connectToNewUser = (userId, stream) => {
  const call = peer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  peers[userId] = call;
}


const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  var videoElement =document.createElement('div');
  videoElement.classList.add("video__element");
  videoElement.appendChild(video);
  video.addEventListener('loadedmetadata', () => {
    video.play();
  })
  videoGrid.append(videoElement);
}

//show-hide  main__left
const isHidden = (screen) => screen.classList.contains("screen-hide");

var activeSreen = "";
const handleScreen = (screen) => {
  const left_container = document.querySelector(".main__left");
  const right_container = document.querySelector(".main__right");
  const chatScreen = document.getElementById("chat-screen");
  const usersScreen = document.getElementById("users-screen");

  if (screen.id === "chats") {
    handleActive("chat-btn");
    if (activeSreen === "") {
      chatScreen.classList.remove("screen-hide");
      
      activeSreen = "chats";
    } else if (activeSreen === "chats") {
      chatScreen.classList.add("screen-hide");
      activeSreen = "";
    } else {
      chatScreen.classList.remove("screen-hide");
      usersScreen.classList.add("screen-hide");
      activeSreen = "chats";
      handleActive("users-btn");
    }
  } else {
    handleActive("users-btn");
    if (activeSreen === "") {
      usersScreen.classList.remove("screen-hide");
      activeSreen = "users";
    } else if (activeSreen === "users") {
      usersScreen.classList.add("screen-hide");
      activeSreen = "";
    } else {
      usersScreen.classList.remove("screen-hide");
      chatScreen.classList.add("screen-hide");
      activeSreen = "users";
      handleActive("chat-btn");
    }
  }

  if (isHidden(right_container)) {
    right_container.classList.remove("screen-hide");
    left_container.classList.remove("screen-full");
    document.querySelector(".main__controls").style.width = '80%'
  } else if (activeSreen === "") {
    right_container.classList.add("screen-hide");
    left_container.classList.add("screen-full");
    document.querySelector(".main__controls").style.width = '100%'
  }
};

const handleActive = (buttonClass) => {
  const button = document.querySelector(`.${buttonClass}`);
  const active = button.classList.contains("active-btn");

  if (active) button.classList.remove("active-btn");
  else button.classList.add("active-btn");
};

//list participants
socket.on("participants", (users) => {
  const nbUser=users.length
  document.getElementById("nb_Participants").innerHTML=nbUser; 
  const lists = document.getElementById("users");
  lists.innerHTML = "";
  lists.textContent = "";

  users.forEach((user) => {
    const list = document.createElement("li");
    list.className = "user";
    list.innerHTML = `
            <div class="user__avatar">${user.id[0].toUpperCase()}</div>
            <span class="user__name">${user.id.substr(0, 6)} ${user.id == myID ? " (You)" : ""}</span>
            <div class="user__media">
                <i class="fas fa-microphone${user.audio === false ? "-slash" : ""}"></i>
                <i class="fas fa-video${user.video === false ? "-slash" : ""}"></i>
            </div>
        `;
      
    lists.append(list);
  });
});









// const videoElement =document.createElement('div');
// videoElement.classList.add("video__element");
// const videoElement =document.createElement('div');
// videoElement.style.width="200px";
// videoElement.style.height="200px";
// videoElement.style.margin="15px";
// videoElement.style.backgroundColor="red";
// videoElement.appendChild(video);
// var avDiv=document.createElement('div');
// avDiv.id="avtar";
// avDiv.innerHTML=`ID : <span> ${myID.substr(0, 6)} ( You ) <span>`;
// videoElement.classList.add("video__element");
// videoElement.append(video);