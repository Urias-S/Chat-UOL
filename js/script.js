const UUID = "ccccbc19-778c-49b3-8970-1bdf885ee69e";
const requisitionsLinkParticipants = "https://mock-api.driven.com.br/api/v6/uol/participants/" + UUID;
const requisitionsLinkStatus = "https://mock-api.driven.com.br/api/v6/uol/status/" + UUID;
const requisitionsLinkMessages = "https://mock-api.driven.com.br/api/v6/uol/messages/" + UUID;
let currentUser;
let username;
let messages = [];
let lastMessageCount = 0;
let usersOnlineCount = 0;
const usersContainer = document.querySelector(".contacts");
function loggin() {
  username = prompt("Qual é o seu nome?");
  const user = {
    name: username
  };
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
        if (messages[i].from === currentUser || messages[i].to === currentUser) {
          messagesContainer.innerHTML += `
          <span class="message" id="privateMessage">
            <span class="time">(${messages[i].time})</span>
            <span class="content">${messages[i].from} ${messages[i].text}</span>
          </span>
      `;
        }
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

const searchUser = () => {
  const promise = axios.get(requisitionsLinkParticipants);
  promise.then(renderizeUsers);
}
const showUsers = () => {
  const messageData = document.querySelector('.messageData');
  const background = document.querySelector(".background");
  background.classList.remove("hidden");
  messageData.classList.remove("hidden");
  messageData.classList.add("animate__animated");
  messageData.classList.add("animate__slideInRight");
}

const closeUsers = () => {
  const messageData = document.querySelector('.messageData');
  const background = document.querySelector(".background");
  messageData.classList.remove("animate__slideInRight");
  messageData.classList.add("animate__slideOutRight");
  setTimeout(() => {
    background.classList.add("hidden");
    messageData.classList.add("hidden");
    messageData.classList.remove("animate__slideOutRight");
  }, 600);
}
const defaultPublic = () => {
  usersContainer.innerHTML = `
<button class="contact checkmarked" onclick = "selectUser(this)">
  <div class="username">
    <ion-icon name="people"></ion-icon>
    <h3>Todos</h3>
  </div>
  <ion-icon name="checkmark-outline" class="checkmark"></ion-icon>
</button>`
}
const renderizeUsers = (requisition) => {
  if (usersOnlineCount === requisition.data.length) {
    return;
  }
  let usersOnline = requisition.data;
  usersOnlineCount = usersOnline.length;
  usersContainer.innerHTML = `
<button class="contact checkmarked" onclick = "selectUser(this)">
  <div class="username">
    <ion-icon name="people"></ion-icon>
    <h3>Todos</h3>
  </div>
  <ion-icon name="checkmark-outline" class="checkmark"></ion-icon>
</button>`
  for (let i = 0; i < usersOnline.length; i++) {
    if (usersOnline[i].name !== currentUser) {
      usersContainer.innerHTML += `
      <button class="contact" onclick = "selectUser(this)">
        <div class="username">
          <ion-icon name="person-circle"></ion-icon>
          <h3>${usersOnline[i].name}</h3>
        </div>
      </button>
    `
    }
  }
}

const selectUser = (element) => {
  if (element.classList.contains("checkmarked")) {
    return;
  }
  const alredySelected = document.querySelector(".checkmarked");
  if (alredySelected) {
    const checkmarkedToRemove = alredySelected.querySelector('ion-icon[name="checkmark-outline"]');
    alredySelected.removeChild(checkmarkedToRemove);
    alredySelected.classList.remove("checkmarked");
  }
  element.classList.add("checkmarked");
  let checkmarkIonIcon = document.createElement('ion-icon');
  checkmarkIonIcon.setAttribute('name', 'checkmark-outline');
  checkmarkIonIcon.setAttribute('class', 'checkmark');
  element.appendChild(checkmarkIonIcon);
  changeMessagePublic();
}

const selectPublic = (element) => {
  if (element.classList.contains("checkmarked")) {
    return;
  }
  const visibility = document.querySelector('.visibility');
  const alredySelected = visibility.querySelector(".checkmarked");
  if (alredySelected) {
    const checkmarkedToRemove = alredySelected.querySelector('ion-icon[name="checkmark-outline"]');
    alredySelected.removeChild(checkmarkedToRemove);
    alredySelected.classList.remove("checkmarked");
  }
  element.classList.add("checkmarked");
  let checkmarkIonIcon = document.createElement('ion-icon');
  checkmarkIonIcon.setAttribute('name', 'checkmark-outline');
  checkmarkIonIcon.setAttribute('class', 'checkmark');
  element.appendChild(checkmarkIonIcon);
  changeMessagePublic();
}

const renderizeVisibility = () => {
  const visibility = document.querySelector(".visibility");
  const buttonPublic = document.createElement("button");
  const buttonPrivate = document.createElement("button");
  const div = document.createElement("div");
  const privateDiv = document.createElement("div");
  const publicIcon = document.createElement('ion-icon');
  const privateIcon = document.createElement('ion-icon');
  const publicTitle = document.createElement('h3');
  const privateTitle = document.createElement('h3');

  buttonPublic.classList.add("public");
  visibility.appendChild(buttonPublic);
  div.classList.add("publicType");
  buttonPublic.appendChild(div);
  publicIcon.setAttribute('name', 'lock-open');
  publicTitle.innerHTML = 'Público';
  div.appendChild(publicIcon);
  div.appendChild(publicTitle);

  buttonPrivate.classList.add("private");
  visibility.appendChild(buttonPrivate);
  privateDiv.classList.add("publicType");
  buttonPrivate.appendChild(privateDiv);
  privateIcon.setAttribute('name', 'lock-closed');
  privateTitle.innerHTML = 'Reservadamente';
  privateDiv.appendChild(privateIcon);
  privateDiv.appendChild(privateTitle);

  buttonPublic.classList.add("checkmarked");
  let checkmarkIonIcon = document.createElement('ion-icon');
  checkmarkIonIcon.setAttribute('name', 'checkmark-outline');
  checkmarkIonIcon.setAttribute('class', 'checkmark');
  buttonPublic.appendChild(checkmarkIonIcon);

  buttonPublic.setAttribute('onclick', 'selectPublic(this)');
  buttonPrivate.setAttribute('onclick', 'selectPublic(this)');
}

const changeMessagePublic = () => {
  const textArea = document.querySelector('.text-area');
  const span = document.createElement('span');
  const visibility = document.querySelector('.visibility');
  const markedVisibility = visibility.querySelector('.checkmarked');
  const markedH3 = markedVisibility.querySelector('h3');
  const contacts = document.querySelector('.contacts')
  const markedContact = contacts.querySelector('.checkmarked');
  const markedContactH3 = markedContact.querySelector('h3');
  let publicMessageType;
  let userMessageName;

  if (textArea.querySelector('span')) {
    const spanToRemove = textArea.querySelector('span');
    textArea.removeChild(spanToRemove);
  }

  if (markedVisibility || markedContact) {
    publicMessageType = markedH3.innerHTML;
    userMessageName = markedContactH3.innerHTML;

  }

  span.innerHTML = `Enviando para ${userMessageName} (${publicMessageType})`;
  textArea.appendChild(span);
}

const sendMessage = () => {
  const contacts = document.querySelector('.contacts')
  const markedContact = contacts.querySelector('.checkmarked');
  const markedContactH3 = markedContact.querySelector('h3');
  const input = document.querySelector('.messageContent');
  const visibility = document.querySelector('.visibility');
  const markedVisibility = visibility.querySelector('.checkmarked');
  const markedH3 = markedVisibility.querySelector('h3');
  let messageType;

  if (markedH3.innerHTML === 'Público') {
    messageType = 'message';
  } else if (markedH3.innerHTML === 'Reservadamente') {
    messageType = 'private_message';
  }
  const messageToSend = {
    from: currentUser,
    to: markedContactH3.innerHTML,
    text: input.value,
    type: messageType,
  }

  const promise = axios.post(requisitionsLinkMessages + UUID, messageToSend);
  promise.then(getMessages);
  promise.catch(reloadPage);
  input.value = '';
}
 
const reloadPage = () => {
  window.location.reload();
}
loggin();
getMessages();
searchUser();
renderizeVisibility();
defaultPublic();
changeMessagePublic();
const connectionInterval = setInterval(maintainConnection, 5000);
const getMessagesInterval = setInterval(getMessages, 3000);
const usersInterval = setInterval(searchUser, 10000);