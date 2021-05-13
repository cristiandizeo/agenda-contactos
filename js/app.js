const formularioContactos = document.querySelector("#contacto"),
  listadoContactos = document.querySelector('#listado-contactos tbody');

eventListeners();
function eventListeners() {
  //Cuando el formulario de crear o editar se ejecuta
  formularioContactos.addEventListener("submit", leerFormulario);

  //listener para eliminar 
  if(listadoContactos){
  listadoContactos.addEventListener("click", eliminarContacto);
}
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
      //agregar
      insertarBD(infoContacto);
    } else {
      //editar
      const idRegistro = document.querySelector('#id').value;
      infoContacto.append('id', idRegistro);
      actualizarRegistro(infoContacto);
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

      nuevoContacto.innerHTML = `
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
function actualizarRegistro(datos){
  // console.log(...datos);
  
  //crear el objeto
  const xhr = new XMLHttpRequest();

  //abrir la conexion
  xhr.open('POST', 'inc/modelos/modelo-contactos.php', true);
  
  //leer la respuesta
  xhr.onload = function(){
    if(this.status === 200){

      const respuesta = JSON.parse(xhr.responseText);
      // console.log(respuesta);
      if(respuesta.respuesta == 'correcto'){
        //mostrar noti correcto
        mostrarNotificacion('¡Contacto modificado!', 'correcto');
      }else{
        //mostrar noti error
        mostrarNotificacion('Hubo un error', 'error');
      }
      //despues de 3 seg redireccionar
      setTimeout(()=> {
        window.location.href = 'index.php';
      },1500);
    }
  }

  //enviar la peticion
  xhr.send(datos);
}

//eliminar el contacto
function eliminarContacto(e) {
  if (e.target.parentElement.classList.contains('btn-borrar')) { //buscar el boton
    //tomar el id
    const id = e.target.parentElement.getAttribute('data-id');
    console.log(id);

    const respuesta = confirm('¿Desea eliminar el registro?');
    if (respuesta) {
      //llamado a ajax      
      //crear el objeto
      const xhr = new XMLHttpRequest();

      //abrir la conexion
      xhr.open('GET', `inc/modelos/modelo-contactos.php?id=${id}&accion=borrar`, true);
      // console.warn(xhr.responseText)
      console.log(xhr);
      //leer la respuesta
      xhr.onload = function(){
      if(this.status === 200){
        const resultado = JSON.parse(xhr.responseText);
        // console.log(resultado);

        if(resultado.respuesta === 'correcto'){
          //eliminar registro del DOM
          console.log(e.target.parentElement.parentElement.parentElement);
          e.target.parentElement.parentElement.parentElement.remove();


          //notificacion
          mostrarNotificacion('Contacto eliminado', 'correcto');

        } else {
          mostrarNotificacion('Hubo un error', 'error');
        }
      }
    }

      //enviar la peticion
      xhr.send();
    }
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