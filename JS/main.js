// --------------------------------- CREAR CUENTA ---------------------------------------
document.addEventListener("DOMContentLoaded", function() {
    const formCrear = document.getElementById("formulario-crearcuenta"); 

    formCrear.addEventListener("submit", function(event) {
        event.preventDefault(); //evitar que se envíe el formulario

        // guarda los datos tomados del formulario
        const nombreUsuario = document.getElementById("nombreUsuario").value;
        const apellidoUsuario = document.getElementById("apellidoUsuario").value;
        const email = document.getElementById("email").value;
        const contrasenia = document.getElementById("password").value;

        // crea un objeto para almacenar los datos del usuario.
        const userData = {
            nombreUsuario: nombreUsuario,
            apellidoUsuario: apellidoUsuario,
            email: email,
            contrasenia: contrasenia
        };

        // alerta si no lleno un valor
        if (nombreUsuario === "" || apellidoUsuario === "" || email === "" || contrasenia === "") {
            alert("Por favor completa todos los campos!!");
        }

        // convierte el objeto en una cadena JSON y guarda en localStorage
        localStorage.setItem("userData", JSON.stringify(userData));

        alert(`Te enviamos un mail a ${email} para confirmar la cuenta así comienza a utilizarla.`);
    });
});


// -------------------------------------INICIAR SESION-----------------------------------

document.addEventListener("DOMContentLoaded", function() {
    const formInicio = document.querySelector("#formulario-inicioSesion");
    
    formInicio.addEventListener("submit", function(event) {
        event.preventDefault();

        const datosAlmacenados = JSON.parse(localStorage.getItem("userData"));
        const nombreUsuarioIngresado = document.getElementById("email").value;
        const contraUsuarioIngresado = document.getElementById("password").value;

        if (datosAlmacenados && datosAlmacenados.email === nombreUsuarioIngresado && datosAlmacenados.contrasenia === contraUsuarioIngresado) {
            // guarda en una variable el nombre y apellido para luego mostrarlo en el header
            const nombreCompletoUsuario = `@${datosAlmacenados.nombreUsuario}${datosAlmacenados.apellidoUsuario}`;
            localStorage.setItem("user", nombreCompletoUsuario);
            window.location.href = "../wiframes/cargaProductos.html"; // cambia de html al poder ingresar
        } else {
            alert("Credenciales incorrectas. Por favor, verifica tus datos.");
        }
    });
});


// ---------------------------------------CARGAR PRODUCTO--------------------------------

// MUESTRA NOMBRE + APELLIDO EN DOM HEADER
document.addEventListener("DOMContentLoaded", function() {
    const user = localStorage.getItem("user");
    const userCompleto = document.getElementById("mostrarNombreCompleto"); //toma elemento del html

    //si ambos no estan vacios cambia el texto del DOM
    if (user && userCompleto) {
        userCompleto.textContent = user;
    }
});


// ACCIONES A REALIZAR PARA QUE FUNCIONE EL BOTON DE CALCULAR PRECIO FINAL
const direccionCalle1 = document.getElementById("direccion1").value;
const direccionLocalidad1 = document.getElementById("localidad1").value;
const direccionCalle2 = document.getElementById("direccion2").value;
const direccionLocalidad2 = document.getElementById("localidad2").value;

function calcularDistancia() {

    const direccionDesde = `${direccionCalle1} ${direccionLocalidad1}`;
    const direccionHasta = `${direccionCalle2} ${direccionLocalidad2}`;

    const apiKey = "2NR4Nq25iHgwr6HgiD7zCAFMIAzt8ilq"; //APIkey MapQuest

    // URL referencia y une apikey y direcciones
    const url = `https://www.mapquestapi.com/directions/v2/route?key=${apiKey}&from=${direccionDesde}&to=${direccionHasta}`;

    // solicitud a la API de MapQuest
    axios.get(url)
        .then(response => {
            const distanciaKilometros = response.data.route.distance * 1.60934; // calcula millas a kilometros

            // Actualiza el DOM con la distancia calculada
            const mostrarKilometros = document.getElementById("mostrarKilometros");
            mostrarKilometros.textContent = `${distanciaKilometros.toFixed(2)} km`; //actualiza el DOM de kilometros

            // llama la funcion calcularprecio con los datos ingresados + kilometros calculados
            calcularPrecio(distanciaKilometros);
        })
        .catch(error => {
            console.error("Error al calcular la distancia:", error);
        });
}

const calcularButton = document.getElementById("botonCalcular");

// llama la funcion calcular distancia
calcularButton.addEventListener("click", function (event) {
    event.preventDefault();
    calcularDistancia();
});

// funcion calcular el precio
function calcularPrecio(distancia) {
    const alto = parseFloat(document.getElementById("alto").value);
    const ancho = parseFloat(document.getElementById("ancho").value);
    const profundo = parseFloat(document.getElementById("profundo").value);

    // precio tamaño
    let costoTamanio = 0;
    if (alto > 0 && ancho > 0 && profundo > 0) {
        const tamanio = alto + ancho + profundo;
        if (tamanio <= 10) {
            costoTamanio = 50;
        } else if (tamanio <= 20) {
            costoTamanio = 80;
        } else if (tamanio <= 30) {
            costoTamanio = 140;
        } else if (tamanio <= 40) {
            costoTamanio = 190;
        } else if (tamanio <= 50) {
            costoTamanio = 240;
        } else if (tamanio <= 60) {
            costoTamanio = 290;
        } else if (tamanio <= 100) {
            costoTamanio = 500;
        } else {
            alert("Los valores ingresados son muy elevados.");
            return; // Evita calcular el precio si los valores son demasiado altos
        }
    } else {
        alert("Por favor, completa todos los campos antes de calcular el precio.");
        return; // Evita calcular el precio si los campos no estan completos
    }

    // precio kilometro
    let costoKilometros = 0;
    if (distancia > 0 && distancia <= 5) {
        costoKilometros = 200;
    } else if (distancia <= 10) {
        costoKilometros = 350;
    } else if (distancia <= 20) {
        costoKilometros = 400;
    } else if (distancia <= 30) {
        costoKilometros = 450;
    } else if (distancia <= 40) {
        costoKilometros = 500;
    } else if (distancia <= 50) {
        costoKilometros = 550;
    } else if (distancia <= 60) {
        costoKilometros = 600;
    } else if (distancia <= 70) {
        costoKilometros = 650;
    } else if (distancia <= 80) {
        costoKilometros = 700;
    } else if (distancia <= 90) {
        costoKilometros = 750;
    } else if (distancia <= 100) {
        costoKilometros = 800;
    } else {
        costoKilometros = 850;
    }

    const precioFinal = costoTamanio + costoKilometros;

    // Actualiza el DOM con el precio calculado
    const mostrarPrecioFinal = document.getElementById("mostrarPrecio");
    mostrarPrecioFinal.textContent = `$ ${precioFinal.toFixed(2)}`;
}

// VERIFICA QUE LOS DATOS DESDE Y HASTA ESTEN LLENOS

document.addEventListener("DOMContentLoaded", function() {
    const confirmarEnvioButton = document.getElementById("confirmarEnvio");

    confirmarEnvioButton.addEventListener("click", function() {
        const datosDesdeForm = document.querySelector("#formularioDesde");
        const datosHastaForm = document.querySelector("#formularioHasta");

        if (!datosDesdeForm.checkValidity() || !datosHastaForm.checkValidity()) {
            alert("Por favor, completa todos los campos del formulario.");
        } else { //toma el mail ingresado en datos hasta y muestra por alert al concluir el envio
            const email = document.getElementById("emailHasta").value;
            alert(`El envío se cargó correctamente. Solo falta que confirme el email que le enviamos a ${email} y responder adjuntando el comprobante de pago.`);
        }
    });
});


// VALIDACION DE DATOS (LETRAS)

document.addEventListener("DOMContentLoaded", function () {
    const formulario = document.getElementById("formulario");

    // Función de validación para campos de texto
    function validarCampoLetras(campo, span) {
        campo.addEventListener("input", function () {
            const valor = campo.value;
            if (!/^([a-zA-ZñÑáéíóúÁÉÍÓÚ\s])+$/.test(valor)) {
                span.textContent = "✗";
                span.style.color = "red";
            }
             // Verifica si el campo está vacío y muestra un icono vacío
            if (valor.trim() === "") {
                span.textContent = "";
            }
        });
    }

    // Validar Nombre1
    const validacionNombre1 = document.getElementById("validacionNombre1");
    const validacionNombre1span = document.getElementById("validacionNombre1span");
    validarCampoLetras(validacionNombre1, validacionNombre1span);

    // Validar Apellido1
    const validacionApellido1 = document.getElementById("validacionApellido1");
    const validacionApellido1span = document.getElementById("validacionApellido1span");
    validarCampoLetras(validacionApellido1, validacionApellido1span);

    // Validar EntreCalles1
    const validacionEntreCalles1 = document.getElementById("validacionEntreCalles1");
    const validacionEntreCalles1span = document.getElementById("validacionEntreCalles1span");
    validarCampoLetras(validacionEntreCalles1, validacionEntreCalles1span);

    // Validar Nombre2
    const validacionNombre2 = document.getElementById("validacionNombre2");
    const validacionNombre2span = document.getElementById("validacionNombre2span");
    validarCampoLetras(validacionNombre2, validacionNombre2span);

    // Validar Apellido2
    const validacionApellido2 = document.getElementById("validacionApellido2");
    const validacionApellido2span = document.getElementById("validacionApellido2span");
    validarCampoLetras(validacionApellido2, validacionApellido2span);

    // Validar EntreCalles2
    const validacionEntreCalles2 = document.getElementById("validacionEntreCalles2");
    const validacionEntreCalles2span = document.getElementById("validacionEntreCalles2span");
    validarCampoLetras(validacionEntreCalles2, validacionEntreCalles2span);

    // Validar el formulario completo antes de enviarlo
    formulario.addEventListener("submit", function (event) {
        const valorNombre1 = validacionNombre1.value;
        const valorApellido1 = validacionApellido1.value;
        const valorEntreCalles1 = validacionEntreCalles1.value;
        const valorNombre2 = validacionNombre2.value;
        const valorApellido2 = validacionApellido2.value;
        const valorEntreCalles2 = validacionEntreCalles2.value;

        if (!/^([a-zA-ZñÑáéíóúÁÉÍÓÚ\s])+$/.test(valorNombre1) || !/^([a-zA-ZñÑáéíóúÁÉÍÓÚ\s])+$/.test(valorApellido1) || !/^([a-zA-ZñÑáéíóúÁÉÍÓÚ\s])+$/.test(valorEntreCalles1) || !/^([a-zA-ZñÑáéíóúÁÉÍÓÚ\s])+$/.test(valorNombre2) || !/^([a-zA-ZñÑáéíóúÁÉÍÓÚ\s])+$/.test(valorApellido2) || !/^([a-zA-ZñÑáéíóúÁÉÍÓÚ\s])+$/.test(valorEntreCalles2)) {
            // No envía el formulario si uno de los valores no es válido
            event.preventDefault();
        }
    });
});

// VALIDACION DE DATOS (NUMEROS)

document.addEventListener("DOMContentLoaded", function () {
    const formulario = document.getElementById("formulario");

    // Función de validación para campos de texto
    function validarCampoNumeros(campo, span) {
        campo.addEventListener("input", function () {
            const valor = campo.value;
            if (!/^[0-9]+$/.test(valor)) {
                span.textContent = "✗";
                span.style.color = "red";
            }
             // Verifica si el campo está vacío y muestra un icono vacío
            if (valor.trim() === "") {
                span.textContent = "";
            }
        });
    }

    // Validar celular1
    const validacionCelular1 = document.getElementById("validacionCelular1");
    const validacionCelular1span = document.getElementById("validacionCelular1span");
    validarCampoNumeros(validacionCelular1, validacionCelular1span);

    // Validar codigopostal1
    const validacionCP1 = document.getElementById("validacionCP1");
    const validacionCP1span = document.getElementById("validacionCP1span");
    validarCampoNumeros(validacionCP1, validacionCP1span);

    // Validar celular2
    const validacionCelular2 = document.getElementById("validacionCelular2");
    const validacionCelular2span = document.getElementById("validacionCelular2span");
    validarCampoNumeros(validacionCelular2, validacionCelular2span);

    // Validar codigopostal2
    const validacionCP2 = document.getElementById("validacionCP2");
    const validacionCP2span = document.getElementById("validacionCP2span");
    validarCampoNumeros(validacionCP2, validacionCP2span);

    // Validar alto
    const validacionAlto = document.getElementById("validacionAlto");
    const validacionAltospan = document.getElementById("validacionAltospan");
    validarCampoNumeros(validacionAlto, validacionAltospan);
    
    // Validar ancho
    const validacionAncho = document.getElementById("validacionAncho");
    const validacionAnchospan = document.getElementById("validacionAnchospan");
    validarCampoNumeros(validacionAncho, validacionAnchospan);

    // Validar profundo
    const validacionProfundo = document.getElementById("validacionProfundo");
    const validacionProfundospan = document.getElementById("validacionProfundospan");
    validarCampoNumeros(validacionProfundo, validacionProfundospan);

    // Validar el formulario completo antes de enviarlo
    formulario.addEventListener("submit", function (event) {
        const valorCelular1 = validacionCelular1.value;
        const valorCP1 = validacionCP1.value;
        const valorCelular2 = validacionCelular2.value;
        const valorCP2 = validacionCP2.value;
        const valorAlto = validacionAlto.value;
        const valorAncho = validacionAncho.value;
        const valorProfundo = validacionProfundo.value;

        if (!/^[0-9]+$/.test(valorCelular1) || !/^[0-9]+$/.test(valorCP1) || !/^[0-9]+$/.test(valorCelular2) || !/^[0-9]+$/.test(valorCP2) || !/^[0-9]+$/.test(valorAlto) || !/^[0-9]+$/.test(valorAncho) || !/^[0-9]+$/.test(valorProfundo)) {
            // No envía el formulario si uno de los valores no es valido
            event.preventDefault();
        }
    });
});
