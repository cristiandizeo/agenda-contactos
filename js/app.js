const formularioContactos = document.querySelector("#contacto"),
  listadoContactos = document.querySelector('#listado-contactos tbody');

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
    telefono = document.querySelector("#telefono").value,
    accion = document.querySelector('#accion').value;

  if (nombre === "" || empresa === "" || telefono === "") {
    //parametros texto y clase
    mostrarNotificacion("Todos los campos son obligatorios", "error");
  } else {
    //pasa la validacion crear llamado a ajax
    const infoContacto = new FormData();
    infoContacto.append('nombre', nombre);
    infoContacto.append('empresa', empresa);
    infoContacto.append('telefono', telefono);
    infoContacto.append('accion', accion);

    console.log(...infoContacto);

    if (accion === 'crear') {
      insertarBD(infoContacto);
    } else {

    }
  }
}
//inserta en bdd por ajax
function insertarBD(datos) {
  //llamado a ajax
  const xhr = new XMLHttpRequest();
  //crear objeto
  xhr.open('POST', 'inc/modelos/modelo-contactos.php', true);
  //abrir conexion
  xhr.onload = function () {
    if (this.status === 200) {
      console.log(JSON.parse(xhr.responseText));
      //lee respuesta php
      const respuesta = JSON.parse(xhr.responseText);

      //inserta un nuevo elemento a la tabla
      const nuevoContacto = document.createElement('tr');

      nuevoContacto.innerHTML =`
      <td>${respuesta.datos.nombre}</td>
      <td>${respuesta.datos.empresa}</td>
      <td>${respuesta.datos.telefono}</td>
      `;
      //contenedor para botones
      const contenedorAcciones = document.createElement('td');

      //crear el icono Editar
      const iconoEditar = document.createElement('i');
      iconoEditar.classList.add('fas', 'fa-pen-square');

      //crea enlace para editar
      const btnEditar = document.createElement('a');
      btnEditar.appendChild(iconoEditar);
      btnEditar.href = `editar.php?id=$(respuesta.datos.id_insertado)`;
      btnEditar.classList.add('btn', 'btn-editar');

      //agregarlo al padre
      contenedorAcciones.appendChild(btnEditar);
      
      //crear el icono de eliminar
      const iconoEliminar = document.createElement('i');
      iconoEliminar.classList.add('fas', 'fa-trash-alt');


      //crear el boton eliminar
      const btnEliminar = document.createElement('button');
      btnEliminar.appendChild(iconoEliminar);
      btnEliminar.setAttribute('data-id', respuesta.datos.id_insertado);
      btnEliminar.classList.add('btn', 'btn-borrar');

      //agregarlo al padre
      contenedorAcciones.appendChild(btnEliminar);

      //Agregarlo al tr
      nuevoContacto.appendChild(contenedorAcciones);

      //agregarlo con los contactos
      listadoContactos.appendChild(nuevoContacto);

      //resetear form
      document.querySelector('form').reset();
      
      //mostrar notificacion
      mostrarNotificacion('Contacto creado correctamente', 'correcto')
    }
  }
  //pasar datos

  //enviar datos
  xhr.send(datos);
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