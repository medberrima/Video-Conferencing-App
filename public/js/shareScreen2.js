const screenPreview = document.getElementById("screen-preview");

function shareScreen(){
  const constraints = {video: {cursor: "always"},  audio: false  };
  navigator.mediaDevices.getDisplayMedia(constraints)
  .then(stream => {
    screenPreview.srcObject = stream ;
    screenPreview.addEventListener("loadedmetadata", () => {
      screenPreview.play();
    });


  })
}



// socket.emit('share-screen',stream);

socket.on('shareScreen',() =>{ 
  console.log(` share screen`);

  // screenPreview.srcObject = x ;
  // screenPreview.addEventListener("loadedmetadata", () => {
  //   screenPreview.play();
  // });
})

