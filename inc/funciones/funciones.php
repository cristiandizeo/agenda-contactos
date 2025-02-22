<?php

use FFI\Exception;

function obtenerContactos(){
    include 'bd.php';
    try{
        return $conn->query("SELECT id, nombre, empresa, telefono FROM contactos");
    } catch(Exception $e){
        echo "Error" . $e->getMessage() . "<br>";
        return false;
    }
}


//Obtiene un contacto y toma un id

function obtenerContacto($id){
    include 'bd.php';
    try{
        return $conn->query("SELECT id, nombre, empresa, telefono FROM contactos WHERE id = $id");
    } catch(Exception $e){
        echo "Error" . $e->getMessage() . "<br>";
        return false;
    }
}