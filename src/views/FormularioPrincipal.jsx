import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../assets/logoVeris.png';
import banner from '../assets/bannerVeris.jpg';
import banner2 from '../assets/bannerVeris3.jpg';
import '../styles/formularioPrincipal.css';
import { Container, Row, Col } from 'react-bootstrap';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import FormularioError from './FormularioError';
import { styled } from '@mui/material/styles';
import { Radio, RadioGroup,  Typography } from '@mui/material';
import { ConsultarPaciente, LoginToken , AceptarPoliticas, persisteConfirmacionPoliticaRepresentante} from '../services/LdpdServices';
import { Base64 } from 'js-base64';

const FormularioPrincipal = () => {
  let { valorFiltro } = useParams();
  let {url} = useParams();



    const [switchChecked, setSwitchChecked] = useState(false);
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [isMenor, setIsMenor] = useState(false);
    const [isAdulto, setIsAdulto] = useState(false);
    const [isNormal, setIsNormal] = useState(false); 
    const [activateSwitch, setActivateSwitch] = useState(false);

   



    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        cedulaRepresentante: "",
        cedulaRepresentado: "",
        parentezco: "",
        motivo: "",
        });

    const checkWindowSize = () => {
        setIsSmallScreen(window.innerWidth <= 768); // Define 768 como el ancho máximo para la relación de aspecto menor
      };
    
      useEffect(() => {
        
        //LoginToken();

        const fetchToken = async () => {
          const token = await LoginToken();
          const age = await ConsultarPacientes(token);
          if (age === 0) {
            window.location.href = '/terminosypoliticas/error' ;
          }
          validarEdad(age);

        };

        fetchToken();

        base64ToString(url);
        console.log(base64ToString(url));

    
        // const fetchAndValidateAge = async () => {
        //     const age = await ConsultarPacientes();
        //     validarEdad(age);
        // };
        
        // fetchAndValidateAge();
        // Verifica el tamaño de la pantalla al cargar la página
        checkWindowSize();
    
        // Agrega un listener para verificar el tamaño de la pantalla cuando cambie
        window.addEventListener("resize", checkWindowSize);
    
        // Limpia el listener cuando el componente se desmonte para evitar problemas de memoria
        return () => {
          window.removeEventListener("resize", checkWindowSize);
        };
      }, []);



    const IOSSwitch = styled((props) => (
        <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
      ))(({ theme }) => ({
        width: 42,
        height: 26,
        padding: 0,
        '& .MuiSwitch-switchBase': {
          padding: 0,
          margin: 2,
          transitionDuration: '300ms',
          '&.Mui-checked': {
            transform: 'translateX(16px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
              backgroundColor: theme.palette.mode === 'dark' ? '#0071CE' : '#0071ce',
              opacity: 1,
              border: 0,
            },
            '&.Mui-disabled + .MuiSwitch-track': {
              opacity: 0.5,
            },
          },
          '&.Mui-focusVisible .MuiSwitch-thumb': {
            color: '#0071ce',
            border: '6px solid #fff',
          },
          '&.Mui-disabled .MuiSwitch-thumb': {
            color:
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[600],
          },
          '&.Mui-disabled + .MuiSwitch-track': {
            opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
          },
        },
        '& .MuiSwitch-thumb': {
          boxSizing: 'border-box',
          width: 22,
          height: 22,
        },
        '& .MuiSwitch-track': {
          borderRadius: 26 / 2,
          backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
          opacity: 1,
          transition: theme.transitions.create(['background-color'], {
            duration: 500,
          }),
        },
      }));

      //  validacion de formulario

      const handleChangeForm = (event) => {
        const { name, value } = event.target;
        let sanitizedValue = value;
    
        if (name === "nombre" || name === "apellido" || name === "parentezco" || name === "motivo") {
          // Filtrar solo letras y espacios en blanco
          sanitizedValue = value.replace(/[^A-Za-záéíóúÁÉÍÓÚñÑüÜ\s]/g, "");
    
          // Validación de longitud de nombre y apellido 29 caracteres
          if (sanitizedValue.length > 29) {
            sanitizedValue = sanitizedValue.substring(0, 29);
          }
        } else if (name === "cedula" || name === "cedulaInfante") {
          // Validar longitud de cedula 20 caracteres
          if (value.length > 20) {
            sanitizedValue = value.substring(0, 20);
          }
        }
    
        setFormData({ ...formData, [name]: sanitizedValue });
      };
    
      //  control de los radio buttons

      const [selectedValue, setSelectedValue] = useState('');
      const [activarFormularioMayores, setActivarFormularioMayores] = useState(false);

      const handleChange = (event) => {
        setSelectedValue(event.target.value);
        

        setActivateSwitch(true);
        if (event.target.value === 'option2') {
          setActivarFormularioMayores(true);
        }
        else {
          setActivarFormularioMayores(false);
        }
        

      };



      // consumo de api para obtener datos del paciente

      
      const ConsultarPacientes = async () => {
        try {
            const response = await ConsultarPaciente(valorFiltro);
            
            
            if (response.data.rows.length === 0) {
                return 0;
            }
            
            localStorage.setItem('nombre', response.data.rows[0].primerNombre);
            const birthDateString = response.data.rows[0].fechaNacimiento.split("/").reverse().join("/");
            const age = calculateAge(birthDateString); 
    
            return age;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };
    


    const recuperarPrimerNombre = () => {
      const nombreCompleto = localStorage.getItem('nombre');
  
      if (!nombreCompleto) {
          return;
      }
  
      return nombreCompleto.split(" ")[0];
  }
  
    

      const calculateAge = (birthDateString) => {
        const birthDate = new Date(birthDateString);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
      };

      const [isDataFetch, setIsDataFetch] = useState(false);

      const validarEdad = (edad) => {
        if (edad < 18) {
            setIsMenor(true);
            setIsAdulto(false);
            setIsNormal(false);
        } else if (edad >= 18 && edad <= 65) {
            setIsNormal(true);
            setIsMenor(false);
            setIsAdulto(false);
        } else {
            setIsAdulto(true);
            setIsMenor(false);
            setIsNormal(false);
        }
        setIsDataFetch(true);
    };

    // consumo de api para aceptar politicas

    const AceptarPoliticasprivacidad = async () => {
        try {
          const response = await AceptarPoliticas(valorFiltro);
        
          if (response.code === 400) {
            setMensajeError(response.message);
            toast.error(response.message, {
              position: "top-right",
              autoClose: 1000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              style: {
                fontSize: '11px' // Tamaño de letra deseado
              }
            });
          }
          else if (response.code === 200) {
            toast.success('Datos enviados', {
              position: "top-right",
              autoClose: 1000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              style: {
                fontSize: '11px' // Tamaño de letra deseado
              }
            });
            const newWindow = window.open(setUrl
              , '_blank', 'noopener,noreferrer')
            window.close();
          }


        } catch (error) {
          console.error(error);
          throw error;
        }
      };


      // enviar datos del menor de edad 
      const [mensajeError, setMensajeError] = useState('');

      const EnviarDatosMenor = async () => {
        try {
          if (!formData.cedulaRepresentante) {
            toast.error('Cédula del representante es requerida', {
              position: "top-right",
              autoClose: 1000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              style: {
                fontSize: '11px' // Tamaño de letra deseado
              }
            });
            return;
          }
          console.log('entro')
          const response = await persisteConfirmacionPoliticaRepresentante(formData, valorFiltro);
          
          if (response.code === 400) {
            setMensajeError(response.message);
            toast.error(response.message, {
              position: "top-right",
              autoClose: 1000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              style: {
                fontSize: '11px' // Tamaño de letra deseado
              }
            });
          }
          

        } catch (error) {
          console.error(error);
          throw error;
        }
      };

      const EnviarDatosAdultoMayor = async () => {
        try {
          
          const response = await persisteConfirmacionPoliticaRepresentante(formData, valorFiltro);
          console.log(response);
          
          if (response.code === 400) {
            setMensajeError(response.message);
            toast.error(response.message, {
              position: "top-right",
              autoClose: 1000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              style: {
                fontSize: '11px' // Tamaño de letra deseado
              }
            });
          }
          else if (response.code === 200) {
            console.log('entro')
          }
          

        } catch (error) {
          console.error(error);
          throw error;
        }
      };

      // base64ToString
      const [setUrl, setSetUrl] = useState('');
      const base64ToString = (url) => {

        const url2 = 'https%3A%2F%2Fdesa.goitsa.me%2Fgoit-mail-analizador%2Fv1%2Faccess%2F0269e269-d737-4e58-9133-358129b0bd85%2FredirectAWS%2FidDetalleProgramacion%3DtestDaniel%26url%3Dhttps%3A%2F%2Fdesagoitsa-test.s3.amazonaws.com%2FAWStest%2Fprueba%2Fpruebas-goitimagenCelularPrueba5.png%26idAnalisis%3D1%26userId%3D09260611?identifierCNM=0269e269-d737-4e58-9133-358129b0bd85';

        try {
          let decodedUrl = decodeURIComponent(url);

          setSetUrl(decodedUrl);

            
          return decodedUrl;
        } catch (error) {
            console.error('Error decodificando base64:', error);
        }
    };
    



      


    


      return (
        
        <>
          <ToastContainer />
          <Container>
          
            <Row className="contenedor_encabezado">
              <Col xs={12} sm={6}>
                {/* En pantallas móviles, ocupará toda la fila. En pantallas medianas, ocupará 6 columnas */}
                <div className="encabezado">
                  <img src={logo} alt="logo" className="logo" width={150} height={75} />
                </div>
              </Col>
              <Col xs={12} sm={6} className="banner_col">
                {/* En pantallas móviles, ocupará toda la fila. En pantallas medianas, ocupará 6 columnas */}
                <div className="banner">
                  {isSmallScreen ? (
                      <img src={banner2} alt="banner" className="img-fluid" />
                  )
                  : (
                      <img src={banner} alt="banner" className="img-fluid" />
                  )}

                  
                  
                </div>
              </Col>
            </Row>
            <Row className="contenedor_formulario">
              <Col xs={10} sm={6}>
                {/* En pantallas móviles, ocupará toda la fila. */}
                <div className="contenedor_aceptacion">
                  

                  {isMenor ? (
                      <React.Fragment>
                          <div className="msjaceptacionContainer">
                              <div className="msjaceptacion">
                              <p>
                                  Para descargar tu documento acepta nuestras políticas de privacidad y protección de datos personales.
                              </p>
                              <p>
                                  Al aceptar las políticas estas asegurando que eres el representante legal de {recuperarPrimerNombre()}.
                              </p>
                              </div>
                          </div>
                          
                          <div className="msjformulario">
                          <p>
                              Por favor ingresa tus datos:
                          </p>
                          </div>

                          <div className="contenedorFormularioMenores">
                          <div className="formularioMenores">
                              <form action="" className='formularioMenoresform' > 
                              <div className="form-group">
                                  <label htmlFor="nombre">Nombre</label>
                                  <input type="text" className="form-control" id="nombre"
                                          name="nombre" value={formData.nombre} onChange={handleChangeForm}
                                  />
                                                </div>
                              <div className="form-group">
                                  <label htmlFor="apellido">Apellido</label>
                                  <input type="text" className="form-control"  id="apellido" name="apellido" value={formData.apellido} onChange={handleChangeForm} />
                              </div>
                              <div className="form-group">
                                  <label htmlFor="cedulaRepresentante">Cédula del Representante</label>
                                  <input type="text" className="form-control"  id="cedulaRepresentante" name="cedulaRepresentante" value={formData.cedulaRepresentante} onChange={handleChangeForm} />
                              </div>
                              <div className="form-group">
                                  <label htmlFor="cedulaRepresentado">Cédula del Infante</label>
                                  <input type="text" className="form-control"  id="cedulaRepresentado" name="cedulaRepresentado" value={formData.cedulaRepresentado} onChange={handleChangeForm} />
                              </div>
                              </form>
                          </div>
                          </div>
                          
                          
                          
                          <div className="aceptacion">
                              <FormControlLabel
                                  control={<IOSSwitch sx={{ m: 1 }} 
                                  checked={switchChecked}
                                  onChange={(e) => setSwitchChecked(e.target.checked)}
                                  />}
                              />
                            <p>Aceptar <a href="https://www.veris.com.ec/politicas/" target="_blank" rel="noopener noreferrer"> política de privacidad de datos.</a></p>

                          </div>
                          <div className="Contenedorbotonaceptacion">
                          <button className={`botonaceptacion ${!switchChecked ? "botonaceptacion-disabled" : ""}`} 
                          type="submit" disabled={!switchChecked} form="formularioMenoresform" onClick={EnviarDatosMenor}>
                              <p className="textobotonaceptacion">Descargar PDF m</p>
                          </button>
                          </div>
                      </React.Fragment>
                      
                  ) : 

                  <React.Fragment>
                    <div className="msjaceptacionContainer">
                      <div className="msjaceptacion">
                      <p>¡{recuperarPrimerNombre()}! Para descargar tu documento acepta nuestras política de privacidad y protección de datos personales.</p>
                      </div>

                      
                      </div>
                      {isAdulto ? (
                        <>
                          <div className='radioButtons'>
                            <RadioGroup value={selectedValue} onChange={handleChange} className='radioButtonsGroup' >
                              <FormControlLabel value="option1" control={<Radio />} label={<Typography className='radioButtonsLabel'>Confirmo que soy {recuperarPrimerNombre()} </Typography>} className='radioButtonsLabel' />
                              <FormControlLabel value="option2" control={<Radio />} label={<Typography className='radioButtonsLabel'>Confirmo que soy el representante legal de {recuperarPrimerNombre()}</Typography>} className='radioButtonsLabel' />
                            </RadioGroup>
                          </div>

                          {activarFormularioMayores ? (
                            <>
                              <div className="msjformulario">
                                <p>
                                    Por favor ingresa tus datos:
                                </p>
                              </div>
                              <div className="contenedorFormularioAdultomayor">
                            
                                <div className="formularioAdultomayor">
                                  <form action="" className="formularioAdultomayorform">
                                    <div className="form-group1">
                                      <label htmlFor="nombre">Nombre</label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="nombre"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChangeForm}
                                      />
                                    </div>
                                    <div className="form-group1">
                                      <label htmlFor="apellido">Apellido</label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="apellido"
                                        name="apellido"
                                        value={formData.apellido}
                                        onChange={handleChangeForm}
                                      />
                                    </div>
                                    <div className="form-group1">
                                      <label htmlFor="Parentezco">Parentezco</label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="parentezco"
                                        name="parentezco"
                                        value={formData.parentezco}
                                        onChange={handleChangeForm}
                                      />
                                    </div>
                                    <div className="form-group1">
                                      <label htmlFor="Motivo">
                                        Motivo por el cual acepta las políticas en reemplazo de {recuperarPrimerNombre()}
                                      </label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="motivo"
                                        name="motivo"
                                        value={formData.motivo}
                                        onChange={handleChangeForm}
                                      />
                                    </div>
                                  </form>
                                </div>
                              </div>
                            </>
                          ) : null}

                        <div className="aceptacion">
                          <FormControlLabel
                            control={<IOSSwitch sx={{ m: 1 }} 
                            checked={switchChecked}
                            onChange={(e) => setSwitchChecked(e.target.checked)}
                            disabled={!activateSwitch}
                            />}
                          />
                        <p>Aceptar <a href="https://www.veris.com.ec/politicas/" target="_blank" rel="noopener noreferrer"> política de privacidad de datos.</a></p>

                      </div>
                      <div className="Contenedorbotonaceptacion">
                        <button className={`botonaceptacion ${!switchChecked ? "botonaceptacion-disabled" : ""}`} 
                        type="button" disabled={!switchChecked}  onClick={EnviarDatosAdultoMayor}>
                            <p className="textobotonaceptacion">Descargar PDF a</p>
                        </button>
                      </div>
                      </>
                      

                    ): null
                      
                    }

                    {isNormal ? (
                      <>
                        <div className="aceptacion">
                            <FormControlLabel
                              control={<IOSSwitch sx={{ m: 1 }} 
                              checked={switchChecked}
                              onChange={(e) => setSwitchChecked(e.target.checked)}
                              
                              />}
                            />
                          <p>Aceptar <a href="https://www.veris.com.ec/politicas/" target="_blank" rel="noopener noreferrer"> política de privacidad de datos.</a></p>

                        </div>
                        <div className="Contenedorbotonaceptacion">
                        <button className={`botonaceptacion ${!switchChecked ? "botonaceptacion-disabled" : ""}`} 
                        type="button" disabled={!switchChecked}  onClick={AceptarPoliticasprivacidad}>
                            <p className="textobotonaceptacion">Descargar PDF</p>
                        </button>
                        </div>
                      
                      </>
                      
                    ) : null}
                    
                      
                      </React.Fragment>
                  
                  }

                </div>
                
              </Col>
            </Row>
          </Container>
        </>
        
        
      );
};

export default FormularioPrincipal;
