const UUID = "b281e7d0-bed8-44dd-9c89-f7e360495cd6";
const requisitionsLinkParticipants = "https://mock-api.driven.com.br/api/v6/uol/participants/" + UUID;
const requisitionsLinkStatus = "https://mock-api.driven.com.br/api/v6/uol/status/" + UUID;
const requisitionsLinkMessages = "https://mock-api.driven.com.br/api/v6/uol/messages/" + UUID;
let currentUser;
let username;
let messages = [];
const loggin = () => {
  username = prompt("Qual é o seu nome?");
  const user = {
    name: username
  }
  userValidation(user);
}
const userValidation = (user) => {
  const promise = axios.post(requisitionsLinkParticipants, user);
  promise.then(setUser);
  promise.catch(alredyLogged);
}

const setUser = (user) => {
  currentUser = username;
  getMessages();
}
const alredyLogged = (requisition) => {
  if (requisition.status === 400) {
    alert("Já existe um usuário com este nome online!");
  }
  loggin();
}

const maintainConnection = () => {
  const currentUserObject = {
    name: currentUser
  }
  const promise = axios.post(requisitionsLinkStatus, currentUserObject);
  promise.catch(disconnected);
}
const disconnected = () => {
  getMessages();
  clearInterval(connectionInterval);
}
const getMessages = () => {
  const promise = axios.get(requisitionsLinkMessages);
  promise.then(renderizeMessages);
  promise.catch(errorMessage);
}

const renderizeMessages = (requisition) => {
  messages = requisition.data;
  const messagesContainer = document.querySelector(".messages");
  for (let i = 0; i < messages.length; i++) {
    switch (messages[i].type) {
      case "status":
        messagesContainer.innerHTML += `
            <span class="message" id="join">
              <span class="time">(${messages[i].time})</span>
              <span class="content">${messages[i].from} ${messages[i].text}</span>
            </span>
        `;
        break;
      case "message":
        messagesContainer.innerHTML += `
            <span class="message" id="publicMessage">
              <span class="time">(${messages[i].time})</span>
              <span class="content">${messages[i].from} ${messages[i].text}</span>
            </span>
        `;
        break;
      case "private_message":
        messagesContainer.innerHTML += `
            <span class="message" id="privateMessage">
              <span class="time">(${messages[i].time})</span>
              <span class="content">${messages[i].from} ${messages[i].text}</span>
            </span>
        `;
        break;
    }
  }
}
const errorMessage = () => {
  alert("Ocorreu algum erro, tente novamente mais tarde!");
}
loggin();
const connectionInterval = setInterval(maintainConnection, 5000);