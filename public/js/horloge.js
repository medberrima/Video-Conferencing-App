
setInterval(displayclock,500)
// 2:52 Friday, August 27,2021 
function displayclock(){
  let d= new Date()
  let hrs =d.getHours();
  let min =d.getMinutes();
  let sec =d.getSeconds();
  let jj =d.getUTCDate();
  let mm =d.getMonth();
  let yy =d.getFullYear();
  
  if(hrs<10){ hrs='0'+hrs }
  if(min<10){ min='0'+min }
  if(sec<10){ sec='0'+sec }
  if(jj<10) { jj='0' +jj  }
  if(mm<10) { mm='0' +mm  }
  
  let days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday',]
  let Jours =days[d.getDay()];

  document.querySelector('.time-header').innerHTML =`<span>${hrs} : ${min} | ${Jours} ${jj}/${mm}/${yy}</span>` ;


  
}

