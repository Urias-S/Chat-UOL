const UUID = "b281e7d0-bed8-44dd-9c89-f7e360495cd6";
const requisitionsLinkParticipants = "https://mock-api.driven.com.br/api/v6/uol/participants/" + UUID;
const requisitionsLinkStatus = "https://mock-api.driven.com.br/api/v6/uol/status/" + UUID;
const requisitionsLinkMessages = "https://mock-api.driven.com.br/api/v6/uol/messages/"+UUID;
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
  console.log("Seja bem vindo: " + currentUser);
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
  promise.catch(loggin);
}

const getMessages = () => {
  const promise = axios.get(requisitionsLinkMessages);
  promise.then(renderizeMessages);
  promise.catch(errorMessage);
}

const renderizeMessages = (requisition) => {
  
}
const errorMessage = () => {
  alert("Ocorreu algum erro, tente novamente mais tarde!");
}
loggin();
const connectionInterval = setInterval(maintainConnection, 5000);
getMessages();