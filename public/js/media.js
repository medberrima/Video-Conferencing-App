
//audio controls
const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    socket.emit("mute-mic");
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    socket.emit("unmute-mic");
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
}
const setMuteButton = () => {
  const html = `
    <i class="fas fa-microphone-alt"></i>
    <span>Mute</span>
  `
  document.querySelector('.mute-btn').innerHTML = html;
}

const setUnmuteButton = () => {
  const html = `
    <i class="unmute fas fa-microphone-alt-slash"></i> 
    <span>Unmute</span>
  `
  document.querySelector('.mute-btn').innerHTML = html;
}

//video controls
const playStop = () => {
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    socket.emit("stop-video");
    setPlayVideo();
    // showInfo(myID);
  } else {
    myVideoStream.getVideoTracks()[0].enabled = true;
    socket.emit("play-video");
    setStopVideo();
    // addVideoStream(myVideo, stream)
  }
}

// const showInfo = (userId) =>{
//   const th = document.createElement('div');
//   th.classList.add('thumbnail');
//   const html = `<div class="thumbnail"><h1>${userId.substr(0, 6)}</h1>  </div>`
//   th.innerHTML = html;
//   document.querySelector(".video__element").appendChild(th);
  // console.log(userId);
// }

const setStopVideo = () => {
  const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
  `
  document.querySelector('.video-btn').innerHTML = html;
}

const setPlayVideo = () => {
  const html = `
  <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
  `
  document.querySelector('.video-btn').innerHTML = html;
}