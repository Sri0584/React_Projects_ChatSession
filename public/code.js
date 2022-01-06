(function () {
  const app = document.querySelector(".app");
  const socket = io();

  let uname;
  var timeout;

  app.querySelector(".join-screen #join-user").addEventListener("click", () => {
    let username = app.querySelector(".join-screen #username").value;

    if (username.length === 0) {
      return;
    }
    socket.emit("newuser", username);
    uname = username;
    app.querySelector(".join-screen").classList.remove("active");
    app.querySelector(".chat-screen").classList.add("active");
  });

  app
    .querySelector(".chat-screen .typebox #message-input")
    .addEventListener("keypress", () => {
      if (app.querySelector(".chat-screen #message-input").value != " ") {
        socket.emit("typing", uname);
        clearTimeout(timeout);
        timeout = setTimeout(timeoutFunction, 2000);
      }
    });
  function timeoutFunction() {
    socket.emit("typing", {});
  }

  socket.on("typing", (data) => {
    if (Object.entries(data.username).length === 0) {
      app.querySelector(".chat-screen #message-input").value = "";
    } else {
      app.querySelector(".chat-screen #message-input").value =
        data.username + " is typing a message...";
    }
  });

  app
    .querySelector(".chat-screen #send-message")
    .addEventListener("click", () => {
      let message = app.querySelector(".chat-screen #message-input").value;
      console.log(message);
      if (message.length === 0) {
        return;
      }
      renderMessage("my", {
        username: uname,
        text: message,
      });
      socket.emit("chat", {
        username: uname,
        text: message,
      });

      app.querySelector(".chat-screen #message-input").value = "";
    });

  app.querySelector(".chat-screen #exit-chat").addEventListener("click", () => {
    socket.emit("exituser", uname);
    window.location.href = window.location.href;
  });
  socket.on("update", (update) => {
    renderMessage("update", update);
  });
  socket.on("chat", (message) => {
    renderMessage("other", message);
  });

  function renderMessage(type, message) {
    let messageContainer = app.querySelector(".chat-screen .messages");
    if (type == "my") {
      let el = document.createElement("div");
      el.setAttribute("class", "message my-message");
      el.innerHTML = `
            <div>
                <div class="name">You</div>
                <div class="text">${message.text}</div>
            </div>
            `;
      messageContainer.appendChild(el);
    } else if (type == "update") {
      let el = document.createElement("div");
      el.setAttribute("class", "update");
      el.innerText = message;
      messageContainer.appendChild(el);
    } else if (type === "other") {
      let el = document.createElement("div");
      el.setAttribute("class", "message other-message");
      el.innerHTML = `
        <div>
            <div class="name">${message.username}</div>
            <div class="text">${message.text}</div>
        </div>
        `;
      messageContainer.appendChild(el);
    }
    //scroll chat to end
    messageContainer.scrollTop =
      messageContainer.scrollHeight - messageContainer.clientHeight;
  }
})();
