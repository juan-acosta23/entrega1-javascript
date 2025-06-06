// Constantes del sistema 
const NOMBRE_SIMULADOR = "Simulador de Diagnóstico de Motos v1.0";
const MAX_INTENTOS_DIAGNOSTICO = 3;
const PRECIO_BASE_REVISION = 50000; // Precio base en pesos argentinos

// Variables globales 
let usuarioActual = "";
let diagnosticoActual = "";
let contadorDiagnosticos = 0;
let historialDiagnosticos = [];

// Arrays con datos del simulador 
const tiposDeMotos = ["Deportiva", "Cruiser", "Naked", "Enduro", "Scooter", "Touring"];

const problemasComunes = [
    {
        id: 1,
        problema: "Motor no enciende",
        causas: ["Batería descargada", "Bujía defectuosa", "Falta de combustible"],
        solucion: "Revisar batería, cambiar bujía y verificar combustible",
        costo: 25000
    },
    {
        id: 2,
        problema: "Motor se apaga constantemente",
        causas: ["Filtro de aire sucio", "Carburador desajustado", "Problema en el sistema eléctrico"],
        solucion: "Limpiar filtro de aire y ajustar carburador",
        costo: 35000
    },
    {
        id: 3,
        problema: "Ruidos extraños en el motor",
        causas: ["Aceite insuficiente", "Cadena desajustada", "Válvulas desajustadas"],
        solucion: "Cambiar aceite y ajustar cadena de distribución",
        costo: 45000
    },
    {
        id: 4,
        problema: "Frenos deficientes",
        causas: ["Pastillas gastadas", "Líquido de frenos bajo", "Discos desgastados"],
        solucion: "Cambiar pastillas y verificar sistema de frenos",
        costo: 60000
    },
    {
        id: 5,
        problema: "Problemas eléctricos",
        causas: ["Alternador defectuoso", "Cables sueltos", "Regulador de voltaje dañado"],
        solucion: "Revisar sistema eléctrico completo",
        costo: 40000
    }
];

const preguntasDiagnostico = [
    "¿La moto enciende normalmente? (si/no)",
    "¿Escucha ruidos extraños? (si/no)",
    "¿Los frenos funcionan correctamente? (si/no)",
    "¿Las luces funcionan bien? (si/no)",
    "¿El motor se mantiene estable en ralentí? (si/no)"
];

// ============ FUNCIONES DEL SIMULADOR ============

function obtenerDatosUsuario() {
    console.log("=== INICIANDO ENTRADA DE DATOS ===");
    
    // Usando prompt para obtener datos
    let nombre = prompt("Bienvenido al " + NOMBRE_SIMULADOR + "\n\n" +
                    "Por favor, ingrese su nombre:");
    
    // Validación con ciclo while
    while (!nombre || nombre.trim() === "") {
        alert("Error: Debe ingresar un nombre válido");
        nombre = prompt("Por favor, ingrese su nombre:");
    }
    
    usuarioActual = nombre.trim();
    
    // Confirmar datos con Confirm
    let confirmacion = confirm("¿Su nombre es " + usuarioActual + "?\n\n" +
                            "Presione OK para continuar o Cancelar para corregir");
    
    if (!confirmacion) {
        return obtenerDatosUsuario();
    }
    
    // Seleccionar tipo de moto - SECCIÓN CORREGIDA
    let tipoMoto = "";
    let opcionesMotos = "Seleccione el tipo de su moto:\n\n";
    
    // Usar for para mostrar opciones
    for (let i = 0; i < tiposDeMotos.length; i++) {
        opcionesMotos += (i + 1) + ". " + tiposDeMotos[i] + "\n";
    }
    
    let seleccion = prompt(opcionesMotos + "\nIngrese el número de su opción:");
    
    let numeroSeleccion = parseInt(seleccion);
    
    // Validación mejorada
    if (numeroSeleccion >= 1 && numeroSeleccion <= tiposDeMotos.length && !isNaN(numeroSeleccion)) {
        tipoMoto = tiposDeMotos[numeroSeleccion - 1];
        console.log("Tipo de moto seleccionado correctamente:", tipoMoto);
    } else {
        alert("Opción inválida. Se asignará 'Tipo General'");
        tipoMoto = "Tipo General";
        console.log("Selección inválida. Valor recibido:", seleccion);
        console.log("Número parseado:", numeroSeleccion);
    }
    
    console.log("Datos del usuario obtenidos:");
    console.log("Nombre: " + usuarioActual);
    console.log("Tipo de moto: " + tipoMoto);
    
    return {
        nombre: usuarioActual,
        tipoMoto: tipoMoto
    };
}

// Función 2: Procesamiento de datos - Diagnóstico
function procesarDiagnostico(datosUsuario) {
    console.log("=== INICIANDO PROCESAMIENTO DE DIAGNÓSTICO ===");
    
    let respuestas = [];
    let puntuacionProblemas = [0, 0, 0, 0, 0]; // Puntuación para cada problema
    
    // Ciclo for para hacer preguntas
    for (let i = 0; i < preguntasDiagnostico.length; i++) {
        let respuesta = prompt("PREGUNTA " + (i + 1) + " de " + preguntasDiagnostico.length + 
                            "\n\n" + preguntasDiagnostico[i]);
        
        // Validar respuesta
        while (respuesta !== "si" && respuesta !== "no" && respuesta !== null) {
            alert("Respuesta inválida. Por favor responda 'si' o 'no'");
            respuesta = prompt(preguntasDiagnostico[i]);
        }
        
        if (respuesta === null) {
            alert("Diagnóstico cancelado por el usuario");
            return null;
        }
        
        respuestas.push(respuesta);
        console.log("Pregunta " + (i + 1) + ": " + respuesta);
        
        // Lógica de puntuación basada en respuestas
        if (i === 0 && respuesta === "no") { // No enciende
            puntuacionProblemas[0] += 3; // Motor no enciende
            puntuacionProblemas[4] += 2; // Problemas eléctricos
        }
        
        if (i === 1 && respuesta === "si") { // Ruidos extraños
            puntuacionProblemas[2] += 3; // Ruidos en motor
            puntuacionProblemas[1] += 1; // Motor se apaga
        }
        
        if (i === 2 && respuesta === "no") { // Frenos mal
            puntuacionProblemas[3] += 3; // Frenos deficientes
        }
        
        if (i === 3 && respuesta === "no") { // Luces mal
            puntuacionProblemas[4] += 3; // Problemas eléctricos
        }
        
        if (i === 4 && respuesta === "no") { // Motor inestable
            puntuacionProblemas[1] += 3; // Motor se apaga
            puntuacionProblemas[0] += 1; // Motor no enciende
        }
    }
    
    // Encontrar el problema más probable
    let maxPuntuacion = 0;
    let problemaDetectado = problemasComunes[0];
    
    // Encontrar el problema con mayor puntuación
    for (let i = 0; i < puntuacionProblemas.length; i++) {
        if (puntuacionProblemas[i] > maxPuntuacion) {
            maxPuntuacion = puntuacionProblemas[i];
            problemaDetectado = problemasComunes[i];
        }
    }
    
    // Crear objeto diagnóstico
    let diagnostico = {
        usuario: datosUsuario.nombre,
        tipoMoto: datosUsuario.tipoMoto,
        respuestas: respuestas,
        problema: problemaDetectado,
        fecha: new Date().toLocaleDateString(),
        numero: ++contadorDiagnosticos
    };
    
    console.log("Diagnóstico procesado:");
    console.log(diagnostico);
    
    return diagnostico;
}

// Función 3: Mostrar resultados
function mostrarResultadosDiagnostico(diagnostico) {
    console.log("=== MOSTRANDO RESULTADOS DEL DIAGNÓSTICO ===");
    
    if (!diagnostico) {
        alert("No se pudo completar el diagnóstico");
        return;
    }
    
    // Guardar en historial
    historialDiagnosticos.push(diagnostico);
    
    // Preparar mensaje de resultado con concatenación y saltos de línea
    let mensaje = "DIAGNÓSTICO COMPLETADO\n" +
                "==============================\n\n" +
                "Usuario: " + diagnostico.usuario + "\n" +
                "Tipo de Moto: " + diagnostico.tipoMoto + "\n" +
                "Fecha: " + diagnostico.fecha + "\n" +
                "Diagnóstico #: " + diagnostico.numero + "\n\n" +
                "PROBLEMA DETECTADO:\n" +
                diagnostico.problema.problema + "\n\n" +
                "POSIBLES CAUSAS:\n";
    
    // Agregar causas con ciclo for
    for (let i = 0; i < diagnostico.problema.causas.length; i++) {
        mensaje += "• " + diagnostico.problema.causas[i] + "\n";
    }
    
    mensaje += "\nSOLUCIÓN RECOMENDADA:\n" +
                diagnostico.problema.solucion + "\n\n" +
                "COSTO ESTIMADO: $" + diagnostico.problema.costo.toLocaleString() + " ARS\n\n" +
                "¿Desea continuar con la reparación?";
    
    // Mostrar resultado con confirm
    let aceptaReparacion = confirm(mensaje);
    
    // Mostrar información en consola
    console.log("RESULTADO DEL DIAGNÓSTICO:");
    console.log("Usuario:", diagnostico.usuario);
    console.log("Problema:", diagnostico.problema.problema);
    console.log("Solución:", diagnostico.problema.solucion);
    console.log("Costo:", "$" + diagnostico.problema.costo.toLocaleString());
    console.log("Acepta reparación:", aceptaReparacion);
    
    if (aceptaReparacion) {
        procesarOrdenReparacion(diagnostico);
    } else {
        alert("Diagnóstico guardado. Puede consultar su historial en cualquier momento.");
    }
    
    return diagnostico;
}

// Procesar orden de reparación
function procesarOrdenReparacion(diagnostico) {
    console.log("=== PROCESANDO ORDEN DE REPARACIÓN ===");
    
    let descuento = 0;
    
    // Aplicar descuento por historial
    if (historialDiagnosticos.length > 1) {
        descuento = 10; // 10% de descuento para clientes frecuentes
    }
    
    let costoFinal = diagnostico.problema.costo * (1 - descuento / 100);
    
    let mensajeOrden = "ORDEN DE REPARACIÓN GENERADA\n" +
                        "================================\n\n" +
                        "Cliente: " + diagnostico.usuario + "\n" +
                        "Servicio: " + diagnostico.problema.solucion + "\n" +
                        "Costo base: $" + diagnostico.problema.costo.toLocaleString() + "\n";
    
    if (descuento > 0) {
        mensajeOrden += "Descuento: " + descuento + "% (cliente frecuente)\n";
    }
    
    mensajeOrden += "TOTAL A PAGAR: $" + costoFinal.toLocaleString() + " ARS\n\n" +
                    "La reparación será programada en los próximos días.\n" +
                    "Gracias por usar nuestro simulador.";
    
    alert(mensajeOrden);
    
    console.log("Orden de reparación generada para:", diagnostico.usuario);
    console.log("Costo final:", "$" + costoFinal.toLocaleString());
}

// Función para mostrar historial
function mostrarHistorial() {
    console.log("=== HISTORIAL DE DIAGNÓSTICOS ===");
    
    if (historialDiagnosticos.length === 0) {
        alert("No hay diagnósticos en el historial");
        return;
    }
    
    let mensajeHistorial = "HISTORIAL DE DIAGNÓSTICOS\n" +
                            "============================\n\n";
    
    // Usar forEach para mostrar historial
    historialDiagnosticos.forEach((diagnostico, index) => {
        mensajeHistorial += "Diagnóstico " + (index + 1) + ":\n" +
                            "Usuario: " + diagnostico.usuario + "\n" +
                            "Problema: " + diagnostico.problema.problema + "\n" +
                            "Fecha: " + diagnostico.fecha + "\n\n";
    });
    
    alert(mensajeHistorial);
    console.log("Historial mostrado - Total diagnósticos:", historialDiagnosticos.length);
}

// Función principal que controla el flujo 
function ejecutarSimuladorDiagnostico() {
    console.log("=== INICIANDO " + NOMBRE_SIMULADOR + " ===");
    
    try {
        // Llamadas a funciones 
        let datosUsuario = obtenerDatosUsuario();
        
        if (datosUsuario) {
            let diagnostico = procesarDiagnostico(datosUsuario);
            let resultado = mostrarResultadosDiagnostico(diagnostico);
            
            // Preguntar si quiere ver el historial
            let verHistorial = confirm("¿Desea ver el historial de diagnósticos?");
            if (verHistorial) {
                mostrarHistorial();
            }
            
            // Preguntar si quiere hacer otro diagnóstico
            let otroDiagnostico = confirm("¿Desea realizar otro diagnóstico?");
            if (otroDiagnostico && contadorDiagnosticos < MAX_INTENTOS_DIAGNOSTICO) {
                ejecutarSimuladorDiagnostico(); // Reinicia el simulador automáticamente
            } else if (contadorDiagnosticos >= MAX_INTENTOS_DIAGNOSTICO) {
                alert("Ha alcanzado el límite máximo de diagnósticos por sesión: " + MAX_INTENTOS_DIAGNOSTICO);
            }
        }
        
    } catch (error) {
        console.error("Error en el simulador:", error);
        alert("Ha ocurrido un error en el simulador. Revise la consola para más detalles.");
    }
    
    console.log("=== SIMULADOR FINALIZADO ===");
    console.log("Total de diagnósticos realizados:", contadorDiagnosticos);
}

// ============ INICIALIZACIÓN DEL SIMULADOR ============

// integracion con el HTML
document.addEventListener('DOMContentLoaded', function() {
    const botonIniciar = document.getElementById('iniciarDiagnostico');
    
    // Evento click del botón
    botonIniciar.addEventListener('click', function() {
        console.log("Botón presionado - Iniciando simulador...");
        ejecutarSimuladorDiagnostico();
    });
    
    // Mensaje de bienvenida en consola
    console.log("===========================================");
    console.log("     " + NOMBRE_SIMULADOR + "     ");
    console.log("===========================================");
    console.log("Simulador cargado correctamente.");
    console.log("Haga clic en 'Iniciar Diagnóstico' para comenzar.");
    console.log("Asegúrese de tener habilitados los pop-ups en el navegador.");
    console.log("===========================================");
});

// Función de demostración para mostrar capacidades
function mostrarCapacidadesSimulador() {
    console.log("=== CAPACIDADES DEL SIMULADOR ===");
    console.log("1. Variables y constantes:", typeof NOMBRE_SIMULADOR);
    console.log("2. Arrays utilizados:", tiposDeMotos.length, "tipos de motos");
    console.log("3. Problemas en base de datos:", problemasComunes.length);
    console.log("4. Funciones implementadas: 6+");
    console.log("5. Interacción: Prompt, Confirm, Alert");
    console.log("6. Algoritmos: Condicionales y ciclos for/while");
    console.log("7. Procesamiento de datos avanzado");
    console.log("================================");
}

// Llamar función de demostración
mostrarCapacidadesSimulador();