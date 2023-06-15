import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import CheckoutSteps from "../../Components/CheckoutSteps";
import { Store } from "../../Context/Store";

export default function PaymentMethodScreen() {
  // Hook 'useNavigate' para la navegación programática
  const navigate = useNavigate();

  // Obtener el estado y el despachador del contexto usando 'useContext'
  const { state, dispatch: ctxDispatch } = useContext(Store);

  // Extraer el método de pago actual del estado global
  const {
    cart: { shippingAddress, paymentMethod },
  } = state;

  // Estado local para el nombre del método de pago seleccionado
  const [paymentMethodName, setPaymentMethod] = useState(
    paymentMethod || "PayPal"
  );

  // Efecto para redirigir al usuario a la pantalla de envío si no se ha proporcionado una dirección de envío
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);

  // Controlador de envío del formulario
  const submitHandler = (e) => {
    e.preventDefault();
    // Despachar una acción para guardar el método de pago seleccionado en el estado global
    ctxDispatch({ type: "SAVE_PAYMENT_METHOD", payload: paymentMethodName });
    // Almacenar el método de pago seleccionado en el almacenamiento local
    localStorage.setItem("paymentMethod", paymentMethodName);
    // Navegar al paso de realizar el pedido
    navigate("/placeorder");
  };

  return (
    <div>
      <CheckoutSteps step1 step2 step3></CheckoutSteps>
      <div className="container small-container">
        <Helmet>
          <title>Métodos de pago</title>
        </Helmet>
        <h1 className="my-3">Métodos de pago</h1>
        <Form onSubmit={submitHandler}>
          <div className="mb-3">
            <Form.Check
              type="radio"
              id="PayPal"
              label="PayPal"
              value="PayPal"
              checked={paymentMethodName === "PayPal"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <Form.Check
              type="radio"
              id="Stripe"
              label="Stripe"
              value="Stripe"
              checked={paymentMethodName === "Stripe"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <Button type="submit">Continuar</Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
