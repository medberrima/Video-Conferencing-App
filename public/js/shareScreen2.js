const screenPreview = document.getElementById("screen-preview");

function shareScreen(){
  const constraints = {video: {cursor: "always"},  audio: false  };
  navigator.mediaDevices.getDisplayMedia(constraints)
  .then(stream => {
    screenPreview.srcObject = stream ;
    screenPreview.addEventListener("loadedmetadata", () => {
      screenPreview.play();
    });
    
    peer.on('call', call => {
      call.answer(stream);

      call.on('stream', userVideoStream => {
        screenPreview.srcObject = userVideoStream ;
        screenPreview.addEventListener("loadedmetadata", () => {
          screenPreview.play();
        });
        console.log('from call stream share ');
      })
    
      call.on('close', () => {
        console.log('close stream')
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

