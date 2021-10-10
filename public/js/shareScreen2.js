const screenPreview = document.getElementById("screen-preview");

function shareScreen(){
  const constraints = {video: {cursor: "always"},  audio: false  };
  navigator.mediaDevices.getDisplayMedia(constraints)
  .then(screenStream => {
    screenPreview.srcObject = screenStream ;
    screenPreview.addEventListener("loadedmetadata", () => {
      screenPreview.play();
    });
    
    peer.on('call', call => {
      call.answer(screenStream)
      call.on('stream', screenVideoStream => {
        screenPreview.srcObject = screenVideoStream ;
        screenPreview.addEventListener("loadedmetadata", () => {
          screenPreview.play();
        });
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

