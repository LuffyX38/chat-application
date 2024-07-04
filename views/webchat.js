const socket = io("http://localhost:3000");
let messages = [];

socket.on("connect", () => {
  console.log("connected: ", socket.id);
  document.getElementById("roomid").innerText = socket.id;
});

//send message to user
document.getElementById("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const message = document.getElementById("message").value;
  const userid = document.getElementById("userid").value;

  socket.emit("message", { message, userid, from: socket.id });
});

//message received to user
socket.on("message-receive", (data) => {
  console.log(`rec: `, data);
  messages.push(data.message);
  document.getElementById("connections").innerText = `From ${data.from}`;
  updateMessage();
});

//populates message
const updateMessage = () => {
  const messagesHere = document.getElementById("messagesHere");
  messagesHere.innerHTML = "";

  messages.forEach((msg) => {
    const p = document.createElement("p");
    p.innerText = msg;
    messagesHere.appendChild(p);
  });
};

document.getElementById("gri").addEventListener("click", (e) => {
  e.preventDefault();
  const uid = `${crypto.randomUUID()}${Date.now()}`;
  document.getElementById("joiningInfo").value = uid;
  document.getElementById("userid").value = uid;
})

document.getElementById("joiningRoom").addEventListener("submit", (e) => {
  e.preventDefault();
  const uid = document.getElementById("dt").value;
  socket.emit("join-room", uid);
  document.getElementById("connectionsRoom").innerText = `🔥Your'e in ${uid}🔥`;

})