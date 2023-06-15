import React from "react";
import "./Styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

function MySlider() {
  return (
    <div id="mySlider" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-inner">
        {/* Los siguientes divs representan los diferentes elementos del carrusel */}
        {/* La clase 'carousel-item' indica que es un elemento del carrusel */}
        {/* El primer elemento tiene la clase 'active' para mostrarlo al cargar la página */}
        <div className="carousel-item active">
          <img
            src="Images/image1.jpg"
            className="d-block w-100"
            alt="Slide 1"
          />
        </div>
        <div className="carousel-item">
          <img
            src="Images/image2.jpg"
            className="d-block w-100"
            alt="Slide 2"
          />
        </div>
        <div className="carousel-item">
          <img
            src="Images/image3.jpg"
            className="d-block w-100"
            alt="Slide 3"
          />
        </div>
        <div className="carousel-item">
          <img
            src="Images/image4.jpg"
            className="d-block w-100"
            alt="Slide 4"
          />
        </div>
        <div className="carousel-item">
          <img
            src="Images/image5.jpg"
            className="d-block w-100"
            alt="Slide 5"
          />
        </div>
      </div>
      {/* Botón para navegar al slide anterior */}
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#mySlider"
        data-bs-slide="prev"
      >
        {/* Icono para el botón de navegación */}
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        {/* Texto alternativo para accesibilidad */}
        <span className="visually-hidden">Anterior</span>
      </button>
      {/* Botón para navegar al siguiente slide */}
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#mySlider"
        data-bs-slide="next"
      >
        {/* Icono para el botón de navegación */}
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        {/* Texto alternativo para accesibilidad */}
        <span className="visually-hidden">Siguiente</span>
      </button>
    </div>
  );
}

export default MySlider;
