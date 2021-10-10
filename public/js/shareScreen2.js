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
      call.answer(stream)
      const video = document.createElement('video')
      call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
      })
    })

    // peer.on('stream', function (stream) {  
    //   // got remote video stream, now let's show it in a video tag  

    //   screenPreview.srcObject = stream;  
    //   screenPreview.play();  
    // })

    
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

