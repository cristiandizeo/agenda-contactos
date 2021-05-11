const formularioContactos = document.querySelector("#contacto");

eventListeners();
function eventListeners() {
  //Cuando el formulario de crear o editar se ejecuta
  formularioContactos.addEventListener("submit", leerFormulario);
}

function leerFormulario(e) {
  e.preventDefault();
  //Leer los datos de los inputs
  const nombre = document.querySelector("#nombre").value,
    empresa = document.querySelector("#empresa").value,
    telefono = document.querySelector("#telefono").value;

  if (nombre === "" || empresa === "" || telefono === "") {
    //parametros texto y clase
    mostrarNotificacion("Todos los campos son obligatorios", "error");
  } else {
    console.log(nombre, empresa, telefono);
  }
}

//notificacion
function mostrarNotificacion(mensaje, clase) {
  const notificacion = document.createElement("div");
  notificacion.classList.add(clase, "notificacion", "sombra");
  notificacion.textContent = mensaje;

  //formulario
  formularioContactos.insertBefore(
    notificacion,
    document.querySelector("form legend")
  );
  //ocultar y mostrar la notificacion
  setTimeout(() => {
    notificacion.classList.add("visible");
    setTimeout(() => {
      notificacion.classList.remove("visible");
      setTimeout(() => {
        notificacion.remove();
      }, 500);
    }, 3000);
  }, 100);
}