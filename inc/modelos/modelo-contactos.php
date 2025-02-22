<?php

use FFI\Exception;

$accion = (isset($_POST['accion'])) ? $_POST['accion'] : $_GET['accion'];

if ($accion == 'crear') {
    require_once('../funciones/bd.php');

    //validar entradas con FILTER
    $nombre = filter_var($_POST['nombre'], FILTER_SANITIZE_STRING);
    $empresa = filter_var($_POST['empresa'], FILTER_SANITIZE_STRING);
    $telefono = filter_var($_POST['telefono'], FILTER_SANITIZE_STRING);

    try {
        $stmt = $conn->prepare("INSERT INTO contactos (nombre, empresa, telefono) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $nombre, $empresa, $telefono);
        $stmt->execute();
        if ($stmt->affected_rows == 1) { //indica cantidad de filas afectadas
            $respuesta = array(
                'respuesta' => 'correcto',
                'datos' => array(
                    'nombre' => $nombre,
                    'empresa' => $empresa,
                    'telefono' => $telefono,
                    'id_insertado' => $stmt->insert_id
                )
            );
        }
        $stmt->close();
        $conn->close();
    } catch (Exception $e) {
        $respuesta = array(
            'error' => $e->getMessage()
        );
    }

    echo json_encode($respuesta);
}

if ($accion == 'borrar') {
    require_once('../funciones/bd.php');

    $id = filter_var($_GET['id'], FILTER_SANITIZE_NUMBER_INT);

    try {
        $stmt = $conn->prepare("DELETE FROM contactos WHERE id = ? ");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        if ($stmt->affected_rows == 1) {
            $respuesta = array(
                'respuesta' => 'correcto'
            );
        }

        $stmt->close();
        $conn->close();
    } catch (Exception $e) {
        $respuesta = array(
            'error' => $e->getMessage()
        );
    }
    echo json_encode($respuesta);
}

if ($accion == 'editar') {
    // echo json_encode($_POST);
    require_once('../funciones/bd.php');

    //validar entradas con FILTER
    $nombre = filter_var($_POST['nombre'], FILTER_SANITIZE_STRING);
    $empresa = filter_var($_POST['empresa'], FILTER_SANITIZE_STRING);
    $telefono = filter_var($_POST['telefono'], FILTER_SANITIZE_STRING);
    $id = filter_var($_POST['id'], FILTER_SANITIZE_NUMBER_INT);

    try {
        $stmt = $conn->prepare("UPDATE contactos SET nombre = ?, empresa = ?, telefono = ? WHERE id = ? ");
        $stmt->bind_param("sssi", $nombre, $empresa, $telefono, $id);
        $stmt->execute();
        if ($stmt->affected_rows == 1) {
            $respuesta = array(
                'respuesta' => 'correcto'
            );
        } else {
            $respuesta = array(
                'respuesta' => 'error'
            );
        };
        $stmt->close();
        $conn->close();
    } catch (Exception $e) {
        $respuesta = array(
            'error' => $e->getMessage()
        );
    }
    
    echo json_encode($respuesta);
}
