const UUID = "05947be4-192e-4286-b7c8-c035a60c9b57";
const requisitionsLinkParticipants = "https://mock-api.driven.com.br/api/v6/uol/participants/" + UUID;
const requisitionsLinkStatus = "https://mock-api.driven.com.br/api/v6/uol/status/" + UUID;
const requisitionsLinkMessages = "https://mock-api.driven.com.br/api/v6/uol/messages/" + UUID;
let currentUser;
let username;
let messages = [];
let lastMessageCount = 0;
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
  clearInterval(connectionInterval);
  loggin();
}
const getMessages = () => {
  const promise = axios.get(requisitionsLinkMessages);
  promise.then(renderizeMessages);
  promise.catch(errorMessage);
}

const renderizeMessages = (requisition) => {
  messages = requisition.data;
  const messagesContainer = document.querySelector(".messages");
  messagesContainer.innerHTML = '';
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

    if (messages.length > lastMessageCount) {
      const lastMessage = messagesContainer.lastElementChild;
      if (lastMessage) {
        lastMessage.scrollIntoView();
      }
    }
  }
  lastMessageCount = messages.length;
}
const errorMessage = () => {
  alert("Ocorreu algum erro, tente novamente mais tarde!");
}
loggin();
const connectionInterval = setInterval(maintainConnection, 5000);
const getMessagesInterval = setInterval(getMessages, 3000);