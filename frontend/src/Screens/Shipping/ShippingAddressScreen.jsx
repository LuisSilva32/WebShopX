import "./Style.css"
import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { Store } from "../../Context/Store";
import CheckoutSteps from "../../Components/CheckoutSteps";

export default function ShippingAddressScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    userInfo,
    cart: { shippingAddress },
  } = state;
  const [fullName, setFullName] = useState(shippingAddress.fullName || "");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ""
  );
  useEffect(() => {
    if (!userInfo) {
      navigate("/signin?redirect=/shipping");
    }
  }, [userInfo, navigate]);
  const [country, setCountry] = useState(shippingAddress.country || "");
  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: {
        fullName,
        address,
        city,
        postalCode,
        country,
      },
    });
    localStorage.setItem(
      "shippingAddress",
      JSON.stringify({
        fullName,
        address,
        city,
        postalCode,
        country,
      })
    );
    navigate("/payment");
  };
  return (
    <div>
      <Helmet>
        <title>Dirección de Envío</title>
      </Helmet>

      <CheckoutSteps step1 step2></CheckoutSteps>
      <div className="container small-container">
        <h1 className="my-3">Direccion de Envío</h1>
        <Form onSubmit={submitHandler}>
            {/* Creamos el label para el nombre */}
          <Form.Group className="mb-3" controlId="fullName">
            <Form.Label>Nombre completo</Form.Label>
            {/* Definimos el controlador de nombre */}
            <Form.Control
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </Form.Group>
          {/* Creamos el label para la dirección */}
          <Form.Group className="mb-3" controlId="address">
            <Form.Label>Dirección</Form.Label>
            {/* Definimos el controlador de dirección */}
            <Form.Control
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </Form.Group>
          {/* Creamos el label para la ciudad */}
          <Form.Group className="mb-3" controlId="city">
            <Form.Label>Ciudad</Form.Label>
            {/* Definimos el controlador de ciudad */}
            <Form.Control
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </Form.Group>
          {/* Creamos el label para el codigo postal */}
          <Form.Group className="mb-3" controlId="postalCode">
            <Form.Label>Codigo postal</Form.Label>
            {/* Definimos el controlador de codigo postal */}
            <Form.Control
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required
            />
          </Form.Group>
          {/* Creamos el label para pais */}
          <Form.Group className="mb-3" controlId="country">
            <Form.Label>País</Form.Label>
            {/* Definimos el controlador de pais */}
            <Form.Control
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </Form.Group>
          {/* El "mb-3" significa margin button = 3 rem */}
          <div className="mb-3"> 
          {/* Creamos el boton para continuar */}
            <Button variant="primary" type="submit">
              Continuar
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}