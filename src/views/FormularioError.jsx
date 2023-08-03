import React from 'react'

import logo from '../assets/logoVeris.png';
import { Container, Row, Col } from 'react-bootstrap';

import '../styles/formularioPrincipal.css';

const FormularioError = () => {
  return (
    <>
        <Container>
          
          <Row className="contenedor_encabezado">
                <Col xs={12} sm={6}>
                {/* En pantallas móviles, ocupará toda la fila. En pantallas medianas, ocupará 6 columnas */}
                <div className="encabezado">
                    <img src={logo} alt="logo" className="logo" width={150} height={75} />
                </div>
                </Col>

                <Col xs={12} sm={6}>
                {/* En pantallas móviles, ocupará toda la fila. En pantallas medianas, ocupará 6 columnas */}
                <div className="errorNoencontrado">
                    <h1 className="titulo">Error usuario no encontrado</h1>
                </div>
                </Col>

            </Row>
        </Container>
    
    
    </>
  )
}

export default FormularioError
