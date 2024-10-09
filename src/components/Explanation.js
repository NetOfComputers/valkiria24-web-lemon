import React from 'react';
import { Container, Typography, Grid, Box } from '@mui/material';

function Explanation() {
    return (
        <Container style={{ paddingTop: '2rem' }}>
            {/* Título Principal */}
            <Typography variant="h4" align="center" gutterBottom>
                Cómo Funciona Nuestro Sistema de Monitorización Remota
            </Typography>

            {/* Introducción */}
            <Typography variant="body1" paragraph>
                Imagina que tienes una <strong>aplicación web</strong> hecha con <strong>React</strong> que te ayuda a monitorear diferentes aspectos de tu entorno, como el cuidado de tus mascotas o la vigilancia de una propiedad. Esta aplicación es muy versátil y puede realizar varias tareas de forma eficiente.
            </Typography>

            {/* Conexión Flexible */}
            <Box marginY={4}>
                <Typography variant="h5" gutterBottom>
                    Conexión por eventos bidireccional
                </Typography>
                <Typography variant="body1" paragraph>
                    A diferencia de otros, utilizamos un protocolo bidireccional que permite realizar eventos cliente-servidor y servidor-cliente, por lo que es más sencillo trabajar
                    de la forma asincrona a la que estamos acostumbrados con lenguajes como JavaScript
                </Typography>
                <img
                    src="./diagrams/netofcomps/d1f1v1.png"
                    alt="Diagrama de Arquitectura"
                    style={{ display: 'block', margin: '0 auto', maxWidth: '100%', height: 'auto' }}
                />
                <Typography variant="body1" paragraph>
                    Hacemos uso de Socketio (una capa sobre websocket) que resuelve el problema de resiliencia y fiabilidad.
                </Typography>
            </Box>
            <Box marginY={4}>
                <Typography variant="h6" gutterBottom>
                    Flujos&nbsp;
                    <strong style={{ color: 'rgb(240 141 2)' }} >Primarios</strong>
                    &nbsp;y&nbsp; 
                    <strong style={{ color: 'rgb(218 119 242)' }} >Secundarios</strong>
                </Typography>
                <Typography variant="body1" paragraph>
                    Existe un <strong>flujo principal</strong> exclusivamente para controlar el servidor y el servicio, este está escrito en socketio cuenta con autenticación independiente
                    y es agnóstico a la funcionalidad que pueda entregar el "worker".
                </Typography>
                <Typography variant="body1" paragraph>
                    Por ejemplo cuando se quiere emitir el contenido de una camara hacia el servidor, podemos usar un script udp que se conecta a otro script udp que recive
                    el streaming de video. Esto sería un flujo secundario.
                </Typography>
            </Box>
            <Box marginY={4}>
                <Typography variant="h5" gutterBottom>
                    <strong>FLUJO PRIMARIO</strong>
                </Typography>
                <Typography variant="body1" paragraph>
                    Para montar una <strong>UI</strong> de control del servicio basta con
                    tener cualquier utilidad que tire peticiones websocket de tipo <strong>socketio</strong> hacia el servidor. En este caso usamos
                    una web en <strong>React</strong> hosteada en un dominio para hacer las peticiones websocket, pero podrían ejecutarse desde cualquier herramienta/lenguaje.
                </Typography>
                <img
                    src="./diagrams/netofcomps/d2f2v1.png"
                    alt="Diagrama de Arquitectura"
                    style={{ display: 'block', margin: '0 auto', maxWidth: '100%', height: 'auto' }}
                />
                <Typography variant="body1" paragraph>
                    La web se comunica por medio del protocolo de socketio con el servidor y si se autentica como es debido, es capaz de hacer peticiones
                    api solo que con la estructura de eventos en vez de request-response de http.
                </Typography>
            </Box>
            <Box marginY={4}>
                <Typography variant="h5" gutterBottom>
                    <strong>FLUJO SECUNDARIO</strong>
                </Typography>
                <Typography variant="body1" paragraph>
                    En este caso se muestra como una pagina web se conectaría exclusivamente al flujo secundario. Con esta arquitectura los flujos se pueden autenticar en
                    funcion de la necesidad y al ser unidireccionales y exclusivos no existe riesgo de contaminacion de datos cruzada.
                </Typography>
                <img
                    src="./diagrams/netofcomps/d3f2v1.png"
                    alt="Diagrama de Arquitectura"
                    style={{ display: 'block', margin: '0 auto', maxWidth: '100%', height: 'auto' }}
                />
                <Typography variant="body1" paragraph>
                    Este es solo un ejemplo, pero una intruccion (flujo primario) puede levantar multiples  servicios y flujos secundarios. Sin embargo
                    cuando queremos tirar un servicio seguimos teniendo siempre el control sobre la ejecución de los mismos.
                </Typography>
            </Box>
            {/* Conexión Flexible */}
            <Box marginY={4}>
                <Typography variant="h5" gutterBottom>
                    <strong>CONCLUSIÓN SOBRE FLUJOS Y CONEXIONES</strong>
                </Typography>
                {/* <img
                    src="./diagrams/netofcomps/d1f1v1.png"
                    alt="Diagrama de Arquitectura"
                    style={{ display: 'block', margin: '0 auto', maxWidth: '100%', height: 'auto' }}
                /> */}
                <Typography variant="body1" paragraph>
                    A diferencia de muchas aplicaciones que dependen de un único servicio HTTPS fijo, nuestra aplicación se conecta directamente a <strong>flujos de datos</strong>. Esto permite acceder a la información y realizar operaciones de manera más dinámica y personalizada, mientras que los flujos de datos manejan la autenticación, añadiendo seguridad y flexibilidad.
                </Typography>
            </Box>

            {/* Rol del Servidor y Raspberry Pi */}
            <Box marginY={4}>
                <Typography variant="h5" gutterBottom>
                    El Rol del Servidor y la Raspberry Pi
                </Typography>
                <Typography variant="body1" paragraph>
                    En el núcleo del sistema hay un <strong>servidor</strong> que actúa como el “jefe de operaciones”. Este servidor mantiene la comunicación con los dispositivos llamados <strong>workers</strong>, como la <strong>Raspberry Pi</strong>.
                </Typography>
                <Typography variant="body1" paragraph>
                    <strong style={{ color: '#ef5252' }}>Resiliencia:</strong> La Raspberry Pi se conecta automáticamente al servidor después de una falla en cualquiera de las dos partes.
                </Typography>
            </Box>

            {/* 
            <Box marginY={4}>
                <Typography variant="h5" gutterBottom>
                    Scripts y Configuración
                </Typography>
                <Typography variant="body1" paragraph>
                    Cada Raspberry Pi tiene un <strong>script</strong> que le ayuda a mantener la comunicación con el servidor. Este script se configura mediante un archivo <strong>JSON</strong>, que indica a la Raspberry Pi qué tareas debe ejecutar.
                </Typography>
            </Box>


            <Box marginY={4}>
                <Typography variant="h5" gutterBottom>
                    Capacidades de la Raspberry Pi
                </Typography>
                <Typography variant="body1" paragraph>
                    Cuando el servidor envía instrucciones a la Raspberry Pi, esta puede llevar a cabo diversas acciones:
                </Typography>
                <ul>
                    <li><strong>Verificar el estado:</strong> Consulta y reporta el estado de los procesos gestionados.</li>
                    <li><strong>Detener o reiniciar scripts:</strong> Permite al servidor detener o reiniciar un script específico.</li>
                    <li><strong>Obtener registros:</strong> Envía registros de actividad al servidor para monitorear el rendimiento.</li>
                    <li><strong>Actualizar su código:</strong> Recibe actualizaciones para utilizar la versión más reciente de su software.</li>
                </ul>
            </Box> */}

            {/* Interacción y Flujos de Datos */}
            <Box marginY={4}>
                <Typography variant="h5" gutterBottom>
                    Interacción y Flujos de Datos
                </Typography>
                <Typography variant="body1" paragraph>
                    La Raspberry Pi mantiene una comunicación bidireccional con el servidor:
                </Typography>
                <ul>
                    <li><strong>Flujos de Datos Independientes:</strong> Cada flujo de datos puede ser autenticado de forma separada, lo que añade seguridad.</li>
                    <li><strong>Mantenibilidad y Flexibilidad:</strong> Permite agregar o modificar funcionalidades sin afectar el funcionamiento general de la aplicación.</li>
                </ul>
            </Box>

            {/* Cliente Web */}
            {/* <Box marginY={4}>
                <Typography variant="h5" gutterBottom>
                    Cliente Web y Conexiones Directas
                </Typography>
                <Typography variant="body1" paragraph>
                    Finalmente, el <strong>cliente web</strong> se conecta directamente a los flujos de datos que necesita, lo que permite acceder a la información y ejecutar tareas específicas de manera inmediata.
                </Typography>
            </Box> */}

            {/* Conclusión */}
            <Box marginY={4}>
                <Typography variant="h5" gutterBottom>
                    Conclusión
                </Typography>
                <Typography variant="body1" paragraph>
                    Este sistema de monitorización remota combina flexibilidad y robustez. La posibilidad de ejecutar diferentes scripts y manejar la información de manera independiente proporciona una experiencia única, ideal para cualquier persona que necesite supervisar su entorno de manera efectiva.
                </Typography>
            </Box>
        </Container>
    );
}

export default Explanation;
