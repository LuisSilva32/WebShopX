import React, { useContext, useReducer, useState } from "react";
import { Helmet } from "react-helmet-async";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Store } from "../../Context/Store";
import { toast } from "react-toastify";
import { getError } from "../../Components/Error";
import axios from "axios";

// Definición del reducer para manejar el estado
const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false };
    default:
      return state;
  }
};

export default function ProfileScreen() {
  // Obtener el estado global y el despachador del contexto
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  // Establecer los estados locales para los campos del formulario
  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Utilizar el reducer para manejar el estado local
  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });

  // Manejador del envío del formulario
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      // Enviar una solicitud PUT al servidor para actualizar el perfil del usuario
      const { data } = await axios.put(
        "/api/users/profile",
        {
          name,
          email,
          password,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      // Actualizar el estado local y global después de una actualización exitosa
      dispatch({
        type: "UPDATE_SUCCESS",
      });
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      // Guardar la información del usuario actualizada en el almacenamiento local
      localStorage.setItem("userInfo", JSON.stringify(data));
      // Mostrar una notificación de éxito
      toast.success("User updated successfully");
    } catch (err) {
      // Manejar el error en caso de fallo de la solicitud
      dispatch({
        type: "FETCH_FAIL",
      });
      // Mostrar una notificación de error con el mensaje de error correspondiente
      toast.error(getError(err));
    }
  };

  return (
    <div className="container small-container">
      <Helmet>
        <title>Perfil</title>
      </Helmet>
      <h1 className="my-3">Perfil de usuario</h1>
      <form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Nueva contraseña</Form.Label>
          <Form.Control
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Confirma tu contraseña</Form.Label>
          <Form.Control
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>
        <div className="mb-3">
          <Button type="submit">Actualizar datos</Button>
        </div>
      </form>
    </div>
  );
}
