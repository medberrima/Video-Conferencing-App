const screenPreview = document.getElementById("screen-preview");

function shareScreen(){
  const constraints = {video: {cursor: "always"},  audio: false  };
  navigator.mediaDevices.getDisplayMedia(constraints)
  .then(stream => {
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
  })
}

// socket.emit('share-screen',stream);

// socket.on('shareScreen',(userId, x) =>{ 
//   console.log(`${userId.substr(0, 6)} share screen`);

  // screenPreview.srcObject = x ;
  // screenPreview.addEventListener("loadedmetadata", () => {
  //   screenPreview.play();
  // });
// })

