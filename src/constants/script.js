function toggleChatbot() {
  let chatbotMinimizado = false;
  let chatbotContainer = document.getElementById("chatbot-container");
  let chatToggle = document.getElementById("chatbot-toggle");
  let chatText = document.getElementById("chatText");

  chatbotMinimizado = !chatbotMinimizado;

  let userInputContainer = document.getElementById("user-input-container");
  if (chatbotContainer.classList.contains("open")) {
    chatbotContainer.classList.remove("open");
    chatToggle.classList.add("burbuja-parpadeante");
    setTimeout(() => {
      chatText.classList.remove("hidden");
    }, 500);
  } else {
    chatToggle.classList.remove("burbuja-parpadeante");
    chatText.classList.add("hidden");
    chatbotContainer.style.display = "block";
    setTimeout(() => chatbotContainer.classList.add("open"), 10);
  }
}

function cerrar() {
  let contenidoInicial = `
    <div id="mensaje-inicial" class="chatbot-message">
      <p>Â¡Saludos! Soy JobHelper, tu guÃ­a virtual en el mundo laboral. Mi misiÃ³n es facilitarte el camino hacia oportunidades laborales que se alineen perfectamente con tus habilidades y expectativas. Â¿Con quÃ© te puedo ayudar?</p>
      <div class="chatbot-button-container">
        <button onclick="mostrarPreguntaPerfil()">Buscar vacantes por categorÃ­a </button>
        <button onclick="iniciarBusquedaPorUbicacion()">Buscar vacantes por ubicaciÃ³n</button>
        <button onclick="seguimientoPostulacion()">Seguimiento de mi postulaciÃ³n</button>
      </div>
    </div>`;
  let chatbotBody = document.querySelector(".chatbot-body");
  chatbotBody.innerHTML = contenidoInicial;
  toggleChatbot();
}

let chatbotMinimizado = false;

document.addEventListener("DOMContentLoaded", function () {
  let chatToggle = document.getElementById("chatbot-toggle");
  chatToggle.classList.add("burbuja-parpadeante"); // Inicia con la animaciÃ³n de parpadeo
});

document.addEventListener("DOMContentLoaded", function () {
  var inputPerfil = document.getElementById("user-input");
  if (inputPerfil) {
    inputPerfil.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        enviarRespuesta();
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  let chatbotToggle = document.getElementById("chatbot-toggle");
  chatbotToggle.addEventListener("click", toggleChatbot);
});

function agregarMensajeChatbot(texto) {
  let contenedorMensajes = document.querySelector(".chatbot-body");
  let mensajeChatbot = document.createElement("div");
  mensajeChatbot.className = "chatbot-message";
  mensajeChatbot.innerHTML = texto;
  contenedorMensajes.appendChild(mensajeChatbot);
  mensajeChatbot.scrollIntoView({ behavior: "smooth" });
}

function agregarMensajeUsuario(texto) {
  if (texto.trim() === "") return;
  let contenedorMensajes = document.querySelector(".chatbot-body");
  let mensajeUsuario = document.createElement("div");
  mensajeUsuario.className = "user-message";
  mensajeUsuario.innerHTML = `<p>${texto}</p>`;
  contenedorMensajes.appendChild(mensajeUsuario);
  mensajeUsuario.scrollIntoView({ behavior: "smooth" });
}

function mostrarPreguntaPerfil() {
  agregarMensajeChatbot("Selecciona la categoria de tu interes:");
  agregarSelectorcategoria();
  // document.getElementById('user-input-container').style.display = 'block';
  deshabilitarBotonesNoSeleccionados(this);
}

function agregarSelectorcategoria() {
  let contenedorMensajes = document.querySelector(".chatbot-body");
  let selectExistente = document.getElementById("seleccion-categoria");
  if (selectExistente) {
    selectExistente.remove();
  }

  let selectCategoria = document.createElement("select");
  selectCategoria.id = "seleccion-categoria";
  selectCategoria.onchange = confirmarB;
  let estados = [
    "AdministraciÃ³n / Oficina",
    "TecnologÃ­a de la InformaciÃ³n",
    "Finanzas / Contabilidad",
    "Marketing",
    "Ventas",
    "Recursos Humanos",
    "Operaciones",
    "IngenierÃ­a",
  ];
  estados.forEach(function (estado) {
    let option = document.createElement("option");
    option.value = estado;
    option.text = estado;
    selectCategoria.appendChild(option);
  });
  let defaultOption = document.createElement("option");
  defaultOption.text = "Seleccione una categoria";
  defaultOption.selected = true;
  defaultOption.disabled = true;
  selectCategoria.insertBefore(defaultOption, selectCategoria.firstChild);
  contenedorMensajes.appendChild(selectCategoria);
  selectCategoria.scrollIntoView({ behavior: "smooth" });
}

function mostrarSeleccionCategoria() {
  let selectCategoria = document.getElementById("seleccion-categoria");
  let categoriaSeleccionada = selectCategoria.value;
  agregarMensajeUsuario(categoriaSeleccionada);
  deshabilitarBotonesNoSeleccionados(selectCategoria);
  iniciarBusqueda(categoriaSeleccionada);
}

function iniciarBusqueda(categoria) {
  confirmarB(categoria);
}

function confirmarB() {
  let selectCategoria = document.getElementById("seleccion-categoria");
  let categoriaSeleccionada = selectCategoria.value;

  agregarMensajeUsuario(`Buscando puestos de ${categoriaSeleccionada}...`);
  // Deshabilitar las opciones del select
  let options = selectCategoria.getElementsByTagName("option");
  for (let option of options) {
    if (option.value !== categoriaSeleccionada) {
      option.disabled = true;
    }
  }

  setTimeout(() => {
    fetch("https://chatbot.giintapeinnovahue.com/cvscategoria.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `seleccion-categoria=${encodeURIComponent(categoriaSeleccionada)}`,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          agregarMensajeChatbot(data.error);
        } else {
          data.forEach((item) => {
            let mensaje =
              `<p>${item.nombre}</p>` +
              `<p>Ãrea: ${item.categoria}</p>` +
              `<p>UbicaciÃ³n: ${item.estado}.</p>` +
              `<p><a href="${item.link}" target="_blank">PostÃºlate</a></p>`;
            agregarMensajeChatbot(mensaje);
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        agregarMensajeChatbot("Hubo un error al buscar la categorÃ­a.");
      });

    setTimeout(function () {
      confirmacionAyuda();
    }, 1000);
  }, 2000);
}

function iniciarBusquedaPorUbicacion() {
  agregarMensajeChatbot("Selecciona la ubicacion de tu interes:");
  agregarSelectorUbicacion();
  // document.getElementById('user-input-container').style.display = 'block';
  deshabilitarBotonesNoSeleccionados(this);
}

function agregarSelectorUbicacion() {
  let contenedorMensajes = document.querySelector(".chatbot-body");
  let selectExistent = document.getElementById("seleccion-cate");
  if (selectExistent) {
    selectExistent.remove();
  }

  let selectUbicacion = document.createElement("select");
  selectUbicacion.id = "seleccion-cate";
  selectUbicacion.onchange = confirmarUbi;
  let estados = ["Ozumba", "Corporativo"];
  estados.forEach(function (estado) {
    let option = document.createElement("option");
    option.value = estado;
    option.text = estado;
    selectUbicacion.appendChild(option);
  });
  let defaultOption = document.createElement("option");
  defaultOption.text = "Seleccione una Ubicacion";
  defaultOption.selected = true;
  defaultOption.disabled = true;
  selectUbicacion.insertBefore(defaultOption, selectUbicacion.firstChild);
  contenedorMensajes.appendChild(selectUbicacion);
  selectUbicacion.scrollIntoView({ behavior: "smooth" });
}

function mostrarSeleccionCategoria() {
  let selectUbicacion = document.getElementById("seleccion-cate").value;
  agregarMensajeUsuario(selectUbicacion);
  selectUbicacion.onchange = confirmarUbi;
  deshabilitarBotonesNoSeleccionados(selectUbicacion);
}

function confirmarUbi() {
  let selectUbicacion = document.getElementById("seleccion-cate");
  let ubicacionSeleccionada = selectUbicacion.value;

  agregarMensajeUsuario(`Buscando puestos en ${ubicacionSeleccionada}...`);
  // Deshabilitar las opciones del select
  let options = selectUbicacion.getElementsByTagName("option");
  for (let option of options) {
    if (option.value !== ubicacionSeleccionada) {
      option.disabled = true;
    }
  }

  setTimeout(() => {
    fetch("https://chatbot.giintapeinnovahue.com/cvsubicacion.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `seleccion-cate=${encodeURIComponent(ubicacionSeleccionada)}`,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          agregarMensajeChatbot(data.error);
        } else {
          data.forEach((item) => {
            let mensaje =
              `<p>${item.nombre}</p>` +
              `<p>UbicaciÃ³n: ${item.estado}</p>` +
              `<p> <a href="${item.link}" target="_blank">PostÃºlate</a></p>`;
            agregarMensajeChatbot(mensaje);
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        agregarMensajeChatbot("Hubo un error al buscar la ubicaciÃ³n.");
      });

    setTimeout(function () {
      confirmacionAyuda();
    }, 1000);
  }, 2000);
}

function seguimientoPostulacion() {
  flujoConversacion = "seguimiento";
  estadoConversacion = "preguntaCorreo";
  agregarMensajeChatbot(
    "Mantente al dÃ­a con tus postulaciones. Por favor ingresa tu correo electrÃ³nico"
  );

  let userInputContainer = document.getElementById("user-input-container");
  if (userInputContainer || chatbotMinimizado) {
    userInputContainer.style.display = "block";
    let userInputField = document.getElementById("user-input");
    if (userInputField) {
      userInputField.disabled = false;
      userInputField.focus();
    }
  }

  deshabilitarBotonesNoSeleccionados(this);
}

function enviarRespuesta() {
  let userInputField = document.getElementById("user-input");
  let userInput = userInputField.value.trim();

  if (userInput.trim() === "") return;

  agregarMensajeUsuario(userInput);

  if (flujoConversacion === "seguimiento") {
    manejarFlujoSeguimiento(userInput);
  }

  /*userInputField.value = ''; EN CASO DE QUERER DESACTIVAR LOS INPUT 
  userInputField.disabled = true;*/
}

function manejarFlujoSeguimiento(userInput) {
  if (estadoConversacion === "preguntaCorreo") {
    if (validateEmail(userInput)) {
      setTimeout(function () {
        agregarMensajeChatbot(
          `Buscando estatus de tus postulaciones asociadas al correo: ${userInput}`
        );
      }, 1000);

      fetch("https://chatbot.giintapeinnovahue.com/csvtest.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userInput }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.length > 0) {
            setTimeout(function () {
              agregarMensajeChatbot("Coincidencias encontradas:");
              data.forEach((item) => {
                let mensaje =
                  `<p> ${item.puesto}</p>` +
                  `<p>Nombre: ${item.nombre} ${item.apellido}</p>` +
                  `<p>Correo: ${item.correo}</p>` +
                  `<p>Estatus: ${item.estatus}</p>`;
                agregarMensajeChatbot(mensaje);
              });
            }, 3000);
          } else {
            setTimeout(function () {
              agregarMensajeChatbot("No se encontraron coincidencias.");
            }, 3000);
          }

          let userInputField = document.getElementById("user-input");
          userInputField.value = "";

          setTimeout(function () {
            confirmacionAyuda();
          }, 4000);
        })
        .catch((error) => {
          console.error("Error al llamar a csvtest:", error);
          agregarMensajeChatbot("OcurriÃ³ un error al procesar la solicitud.");
        });

      estadoConversacion = "Finalizado";
    } else {
      agregarMensajeChatbot(
        "Por favor ingresa un correo electrÃ³nico vÃ¡lido."
      );
      let userInputField = document.getElementById("user-input");
      if (userInputField) {
        userInputField.disabled = false;
        userInputField.value = "";
        userInputField.focus();
      }
    }
  }
}

function validateEmail(email) {
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

function confirmacionAyuda() {
  let botonesHTML = `
        <div class="chatbot-message-buttons" style="margin-top: 20px;">
            <button class="btnSi" style="margin-right: 10px;">SÃ­</button>
            <button class="btnNo">No</button>
        </div>
    `;
  agregarMensajeChatbot("Â¿Puedo ayudarte en algo mÃ¡s? " + botonesHTML);
  let userInputContainer = document.getElementById("user-input-container");
  if (userInputContainer) {
    userInputContainer.style.display = "none";
  }
  setTimeout(() => {
    let contenedorMensajes = document.querySelector(".chatbot-body");
    let botones = contenedorMensajes.querySelectorAll(
      ".chatbot-message-buttons"
    );
    let ultimoBotones = botones[botones.length - 1];

    ultimoBotones.querySelector(".btnSi").addEventListener("click", () => {
      funcionSi();
      bloquearBotones(ultimoBotones);
    });
    ultimoBotones.querySelector(".btnNo").addEventListener("click", () => {
      funcionNo();
      bloquearBotones(ultimoBotones);
    });
  }, 0);
}

function bloquearBotones(ultimoBotones) {
  ultimoBotones.querySelector(".btnSi").disabled = true;
  ultimoBotones.querySelector(".btnNo").disabled = true;
}

function agregarMensajeChatbot(texto) {
  let contenedorMensajes = document.querySelector(".chatbot-body");
  let mensajeChatbot = document.createElement("div");
  mensajeChatbot.className = "chatbot-message";
  mensajeChatbot.innerHTML = texto;
  contenedorMensajes.appendChild(mensajeChatbot);
  mensajeChatbot.scrollIntoView({ behavior: "smooth" });
}

function funcionSi() {
  let contenidoInicial = `
    <div id="mensaje-inicial" class="chatbot-message">
      <p>Â¡Con gusto! Â¿En que mas puedo ayudarte?</p>
      <div class="chatbot-button-container">
        <button onclick="mostrarPreguntaPerfil()">Buscar vacantes por categoria</button>
        <button onclick="iniciarBusquedaPorUbicacion()">Buscar vacantes por ubicacion</button>
        <button onclick="seguimientoPostulacion()">Seguimiento de mi postulacion</button>
      </div>
    </div>`;
  let chatbotBody = document.querySelector(".chatbot-body");
  chatbotBody.insertAdjacentHTML("beforeend", contenidoInicial);
  chatbotBody.lastElementChild.scrollIntoView({ behavior: "smooth" });
}

function funcionNo() {
  setTimeout(function () {
    let mensajeDespedida = `
      <div style="text-align: center;">
        <p>Gracias por usar JobHelper, es un gusto haber podido ayudarte... Â¡Hasta la prÃ³xima!</p>
        <img src="https://chatbot.giintapeinnovahue.com/img/gi.png" alt="" style="margin: 0 auto; display: block; width: 100px; height: auto;"/>
        <p>Impulsado por GIINTAPE INNOVAHUE!</p>
      </div>
    `;
    agregarMensajeChatbot(mensajeDespedida);
  }, 500);

  setTimeout(function () {
    cerrar();
  }, 3500);
}

function deshabilitarBotonesNoSeleccionados(selector) {
  let botones = document.querySelectorAll(".chatbot-button-container button");
  for (let boton of botones) {
    if (boton !== selector) {
      boton.disabled = true;
    }
  }
}
