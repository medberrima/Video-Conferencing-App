const screenPreview = document.getElementById("screen-preview");

shareScreen = () =>{
  const constraints = {video: {cursor: "always"},  audio: false  };
  navigator.mediaDevices.getDisplayMedia(constraints)
  .then(stream => {
    screenPreview.srcObject = stream ;
    screenPreview.addEventListener("loadedmetadata", () => {
      screenPreview.play();
    });

    peer.on('call', call => {
      call.answer(stream)

      call.on('stream', userVideoStream => {
        screenPreview.srcObject = userVideoStream ;
        screenPreview.addEventListener("loadedmetadata", () => {
          screenPreview.play();
        });
      })
    })
    socket.emit('share-screen',stream);
  })
}


socket.on('shareScreen',(userId, screenStream) =>{ 
  console.log(`${userId.substr(0, 6)} share screen`);

  const call = peer.call(userId, screenStream)

  call.on('stream', userVideoStream => {
    screenPreview.srcObject = userVideoStream ;
    screenPreview.addEventListener("loadedmetadata", () => {
      screenPreview.play();
    });
  })
  peers[userId] = call;
})

