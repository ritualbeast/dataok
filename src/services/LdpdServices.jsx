import React from 'react'



const LoginToken = async () => {
  try {
    const base64 = {
      encode: (text) => {
        return btoa(text);
      }
    };
    
    const usuario = 'backendphantom';
    const contrasenia = 'BackP@nth0mP@ss2021';
    const applicationHeader = 'UEhBTlRPTVhfQkFDS0VORA==';
    const token = `Basic ${base64.encode(`${usuario}:${contrasenia}`)}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': token,
      'Application': applicationHeader
    };
    const requestOptions = {
      method: 'POST',
      headers
    };
    const response = await fetch('https://api-phantomx.veris.com.ec/seguridad/v1/autenticacion/login', requestOptions);

    const data = await response.json();
    

    localStorage.setItem('token', data.data.idToken);
  
    return data.data.idToken;
    
  } catch (error) {
    console.error(error);
    throw error; // Lanzar el error para que sea capturado en el lugar donde se llama a la función
  }
};

const ConsultarPaciente = async (valorFiltro) => {

  const tipoFiltro = 'numeroIdentificacion';
  const page = 1;
  const perPage = 1;

  const token = localStorage.getItem('token');
  try {
    const headers = {
      'Authorization': token,
      'Application': 'UEhBTlRPTVhfQkFDS0VORA==',
      'Content-Type': 'application/json'
    };
    const requestOptions = {
      method: 'GET',
      headers
    };
    const url = `https://api-phantomx.veris.com.ec/general/v1/pacientes/consulta_basica?tipoFiltro=${tipoFiltro}&page=${page}&perPage=${perPage}&valorFiltro=${valorFiltro}`;
    const response = await fetch(url, requestOptions);
    
   

    const data = await response.json();
    
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


const AceptarPoliticas = async (identificacionUsuario) => {
  try {
      const url = `https://api.phantomx.com.ec/digitales/v1/politicas/usuarios/${identificacionUsuario}`;
      const body = {
          "aceptaPoliticas": true,
          "versionPoliticas": 3,
          "codigoEmpresa": 1,
          "plataforma": "ANDROID",
          "versionPlataforma": "7.0.1",
          "tipoEvento": "CR",
          "canalOrigen": "APP_PMF"
      };
      const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
      };
      const response = await fetch(url, requestOptions);
      

      const data = await response.json();
      return data;
  } catch (error) {
      console.error(error);
      throw error;
  }
};

const persisteConfirmacionPoliticaRepresentante = async (datosRepresentante, valorFiltro) => {
  
  const usuarioCreacion = 'backendphantom';
  let cedulaRepresentado1 = '';
  if (datosRepresentante.cedulaRepresentado === '') {
    cedulaRepresentado1 = valorFiltro;
  } else
  {
    cedulaRepresentado1 = datosRepresentante.cedulaRepresentado;
  }
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };
  
  const body = {
    "nombre": datosRepresentante.nombre,
    "apellido": datosRepresentante.apellido,
    "cedulaRepresentante": datosRepresentante.cedulaRepresentante,
    "cedulaRepresentado": cedulaRepresentado1,
    "aceptaPoliticas": true,
    "usuarioCreacion": usuarioCreacion,
    "parentezco": datosRepresentante.parentezco,
    "motivo": datosRepresentante.motivo,
  };

  const requestOptions = {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  };
  
  try {
    const response = await fetch('http://desa.goitsa.me:5679/digitales/v1/politicas/persisteConfirmacionPoliticaRepresentante', requestOptions);
    const data = await response.json();
    return data; // Devolver los datos obtenidos
  } catch (error) {
    console.error(error);
    throw error; // Lanzar el error para que sea capturado en el lugar donde se llama a la función
  }
};

  

export  {ConsultarPaciente , LoginToken, AceptarPoliticas, persisteConfirmacionPoliticaRepresentante};
