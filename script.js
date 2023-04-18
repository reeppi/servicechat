
// let HOST = location.origin.replace(/^http/, 'ws')
// console.log(location.origin);
let HOST = "ws://localhost:3001";
let ws;
var chat = [];


const chatMessages = document.getElementById("chatMessages");

function addMessages()
{
  chatMessages.innerText="";
  const ul = document.createElement("ul");
  ul.classList.add("chat");
  chatMessages.appendChild(ul);
  for(let i=0;i<chat.length;i++)
  {
      const newMessage = document.createElement("li");
      newMessage.innerText = chat[i].msg;
      ul.appendChild(newMessage);
  }
  const chatBox  = document.getElementById('chatMessages');
  chatBox.scrollTop = chatBox.scrollHeight;
  
  //const scrollPoint = document.createElement("div");
  //chatMessages.appendChild(scrollPoint);
  //scrollPoint.scrollIntoView({ behavior: "auto" });
}

function startConnection()
{
  console.log("Connecting...");
    ws=new WebSocket(HOST);
    ws.onopen = () => { 

      sessionStorage.setItem('chatEnabled','true');

      const user = sessionStorage.getItem('user');
      if ( user ) 
      {
        console.log("Löytyi vanha user koodi "+ user);
        ws.send(JSON.stringify({event:"LOGIN","payload":{chat:chatName,user}})); 
      }
      else
      { 
        sessionStorage.removeItem('chat');
        ws.send(JSON.stringify({event:"LOGIN","payload":{chat:chatName,user:""}})); 
      }
      if ( sessionStorage.getItem('chat')  )
      {
          chat = JSON.parse(sessionStorage.getItem('chat'));
          addMessages();
      }
    };

    ws.onmessage = (e) => {
      data = JSON.parse(e.data);
      if ( data.event == "MSG")
      {
        chat.push({time:data.payload.time,msg:data.payload.msg});
        sessionStorage.setItem('chat', JSON.stringify(chat));
        addMessages();
      }
      if (data.event == "USER")
      {
        console.log(data.payload.sender);
        sessionStorage.setItem('user', data.payload.sender);
      }

    };
}

const hideButton = document.getElementById('hideButton');
const chatHide = document.getElementById('chatHide');
const chatBox = document.getElementById("chat");
const msgbox = document.getElementById('msgbox');

chatBox.style.display = "none";


const chatEnabled = sessionStorage.getItem('chatEnabled');
if ( chatEnabled )
  startConnection();

const chatBoxVisible= sessionStorage.getItem('chatBoxVisible');
if ( chatBoxVisible == "true" )
{
  chatHide.style.display = "none";
  chatBox.style.display = "flex";
}

var firstConn=false;
var keydown=false;

chatHide.addEventListener('click', () => {
  toggle();
});

hideButton.addEventListener('click', () => {
  toggle();
});

function toggle()
{
  if (!firstConn)
    startConnection();
  firstConn=true;

  if (chatBox.style.display === "none") {
    chatHide.style.display = "none";
    chatBox.style.display = "flex";
    sessionStorage.setItem("chatBoxVisible","true");
  } else {
    chatHide.style.display = "flex";
    chatBox.style.display = "none";
    sessionStorage.setItem("chatBoxVisible","false");
  }
}

msgbox.addEventListener('keydown', (e) => {
 if ( e.key == "Enter" && !keydown)
 {
    ws.send(JSON.stringify({event:"MSG","payload":{chat:"",msg:msgbox.value}}));
    keydown=true;
 }
});

msgbox.addEventListener('keyup', (e) => {
  keydown=false;
 });

const sendbutton = document.getElementById('send');
sendbutton.addEventListener('click', () => {
    console.log("sendbutton");
    console.log("--->"+msgbox.value);
    ws.send(JSON.stringify({event:"MSG","payload":{chat:"",msg:msgbox.value}}));
});