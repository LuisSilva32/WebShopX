import axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../Components/LoadingBox";
import MessageBox from "../Components/MessageBox";
import { Store } from "../Context/Store";
import { getError } from "../Components/Error";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "react-bootstrap/Button";

// Reducer para manejar los estados y acciones relacionados con la carga y eliminación de usuarios
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        users: action.payload,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };
    case "DELETE_SUCCESS":
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false };
    case "DELETE_RESET":
      return { ...state, loadingDelete: false, successDelete: false };

    default:
      return state;
  }
};

export default function UserListScreen() {
  // Obtener la función de navegación desde React Router DOM
  const navigate = useNavigate();
  
  // Definir el estado inicial y el reducer para manejar los estados y acciones
  const [{ loading, error, users, successDelete }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  // Obtener la información del usuario desde el contexto
  const { state } = useContext(Store);
  const { userInfo } = state;

  // Cargar los usuarios al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        
        // Realizar la solicitud GET para obtener los usuarios
        const { data } = await axios.get(`/api/users`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        
        // Actualizar el estado con los usuarios obtenidos
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
      }
    };

    // Reiniciar el estado de eliminación exitosa o cargar los usuarios
    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [userInfo, successDelete]);

  // Manejar la eliminación de un usuario
  const deleteHandler = async (user) => {
    if (window.confirm("¿Estás seguro de eliminar a este usuario?")) {
      try {
        dispatch({ type: "DELETE_REQUEST" });
        
        // Realizar la solicitud DELETE para eliminar al usuario
        await axios.delete(`/api/users/${user._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        
        // Mostrar una notificación de éxito y actualizar el estado
        toast.success("¡Usuario eliminado con éxito!");
        dispatch({ type: "DELETE_SUCCESS" });
      } catch (error) {
        // Mostrar una notificación de error y actualizar el estado
        toast.error(getError(error));
        dispatch({
          type: "DELETE_FAIL",
        });
      }
    }
  };

  return (
    <div>
      <Helmet>
        <title>Usuarios</title>
      </Helmet>
      <h1>Usuarios</h1>
      
      {/* Mostrar un indicador de carga mientras se obtienen los usuarios */}
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        // Mostrar un mensaje de error si ocurre algún error al obtener los usuarios
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        // Mostrar la tabla de usuarios si se obtienen correctamente
        <table className="table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>¿Es administrador?</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {/* Iterar sobre la lista de usuarios y mostrar cada uno en una fila de la tabla */}
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.isAdmin ? "Si" : "No"}</td>
                <td>
                  {/* Botón para editar el usuario */}
                  <Button
                    className="btn-editar"
                    type="button"
                    variant="light"
                    onClick={() => navigate(`/admin/user/${user._id}`)}
                  >
                    Editar
                  </Button>
                  &nbsp;
                  {/* Botón para eliminar el usuario */}
                  <Button
                    className="btn-eliminar"
                    type="button"
                    variant="light"
                    onClick={() => deleteHandler(user)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
