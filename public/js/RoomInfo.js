// share link meeting
let close = document.getElementById("close");
let modal = document.getElementById("room-info");
let linkMeet = window.location.href;
document.getElementById('link-meet').innerHTML = linkMeet ;
document.getElementById('id-meet').innerHTML  = window.location.pathname.substr(1) ;

//copu link
document.getElementById('copy').onclick = () =>{
  navigator.clipboard.writeText(linkMeet);
}

// show modal 
window.onload = () =>{  modal.style.display = "block"  }
const invite = () => {  modal.style.display = "block"; }

// onclick icon close
close.onclick = () =>{  
  modal.style.display = "none";
  // document.getElementById("modal-content").style.animationName= "animatebottom" ;
}

// onclick outside of the modal
window.onclick = (event) => {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}