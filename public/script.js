const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const selfVideoBox = document.getElementById('self-video-box')
const mainVideos = document.getElementById("main__videos");

console.log("test script") ;

const peer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: '443'
});

const users = {};
var myID = "";

let myVideoStream;
const myVideo = document.createElement('video');

myVideo.muted = true;
const peers = {}
console.log(typeof(peers))
// get audio video from user's device
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  myVideoStream = stream;
  myVideo.srcObject = stream;
  myVideo.addEventListener("loadedmetadata", () => {
    myVideo.play();
  });
  selfVideoBox.append(myVideo);

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
    joinedLeftNotif(userId, true);
    joinedLeftMsg(userId, true);
  })
  
  socket.emit("participants");

  //user disconnected
  socket.on('user-disconnected', userId => {
    if (peers[userId]){
      console.log("user disconnected!", userId);
      peers[userId].close();
      joinedLeftNotif(userId);
      joinedLeftMsg(userId);
    } 
    removeVideoElement(userId);
      //adjusting size of videos in grid
      // let totalUsers = document.getElementsByTagName("video").length;
      // console.log(totalUsers);
      // console.log(videoGrid.getElementsByTagName("video")[index].style.width);
      // if (totalUsers >=1) {
      //   for (let index = 0; index < totalUsers; index++) {
      //     console.log(videoGrid.getElementsByTagName("video")[index].style.width);
          // videoGrid.getElementsByTagName("video")[index].style.width = 100 / totalUsers + "%";
          // videoGrid.getElementsByTagName("video")[index].style.height = 100 / totalUsers + "%";
        // }
      // }
  })
})

// joined / left user
const joinedLeftNotif=(userId, join = false)=>{
  document.getElementById('notification').style.display="block " ;
  document.getElementById('notification').innerHTML=`<h4> <span> ${userId.substr(0,6)} </span>  has ${ join ? "joined" : "left "} the meeting</h4>`
  setTimeout( () => {
    document.getElementById('notification').style.display="none "
  }, 3000);
}

peer.on('open', id => {
  console.log(`peer: user join to room ${id} `);
  socket.emit('join-room', ROOM_ID, id);
  myID = id;
})

const connectToNewUser = (userId, stream) => {
  const call = peer.call(userId, stream)
  const video = document.createElement('video')
  video.id = userId;
  console.log(video.id)
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove();
    videoGrid.remove(video);
  })
  peers[userId] = call;
}

//append users videos to grid
const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  // var videoElement =document.createElement('div');
  // videoElement.classList.add("video__element");
  // videoElement.appendChild(video);
  video.addEventListener('loadedmetadata', () => {
    video.play();
  })
  videoGrid.append(video);

  //adjusting size of videos in grid
  // let totalUsers = document.getElementsByTagName("video").length;
  // if (totalUsers >=1) {
  //   for (let index = 0; index < totalUsers; index++) {
  //     videoGrid.getElementsByTagName("video")[index].style.width = 100 / totalUsers + "%";
  //     videoGrid.getElementsByTagName("video")[index].style.height = 100 / totalUsers + "%";
  //   }
  // }
}

removeVideoElement = (id) =>{
  const element = document.getElementById(id)
  element.remove()
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
    document.getElementById('self-video-box').style.right='25%';
  } else if (activeSreen === "") {
    right_container.classList.add("screen-hide");
    left_container.classList.add("screen-full");
    document.querySelector(".main__controls").style.width = '100%';
    document.getElementById('self-video-box').style.right='8%';
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
                <i class="fas fa-microphone-alt${user.audio === false ? "-slash" : ""}"></i>
                <i class="fas fa-video${user.video === false ? "-slash" : ""}"></i>
            </div>
        `
      
    lists.append(list);
  });
});



// const shareBtn = document.getElementById('shareBtn');
// const screenPreview = document.createElement('video');
// screenPreview.id = "screenPreview" ;

// shareBtn.addEventListener("click", (e) => {
//   const constraints = {video: {cursor: "always"},  audio: false  };
//   navigator.mediaDevices.getDisplayMedia(constraints)
//   .then(function(stream) {
//     screenPreview.srcObject = stream ;
//     screenPreview.addEventListener("loadedmetadata", () => {
//       screenPreview.play();
//     });
//     mainVideos.append(screenPreview);

//     socket.emit('share-screen',stream);    
//   })
//   .catch(function(err) { 
//     console.log(err.name + ": " + err.message); 
//   }); 

//   //emit through socket when button is clicked
//   console.log('med')                                           
// });


//listening for shareScreen event
// socket.on('shareScreen',(stream ,userId) =>{  

//   const Preview = document.createElement('video');
//   Preview.controls  = true;
//   addScreenStream(Preview, stream);
//   console.log(userId.substr(0,6) ,' share screen');

  
// })

// const addScreenStream = (Preview, stream) => {
//   Preview.src = stream;
//   Preview.autoplay= true;
//   Preview.addEventListener('loadedmetadata', () => {
//     Preview.play();
//   })
//   mainVideos.append(Preview);
// }


