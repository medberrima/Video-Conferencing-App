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
      call.on('stream', VideoStream => {
        video.srcObject = VideoStream;
        video.addEventListener('loadedmetadata', () => {
          video.play();
        })
        videoGrid.append(video);
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

