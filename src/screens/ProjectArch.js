import React from 'react';
import { Container, Typography, Grid, Card, CardContent, List, ListItem, ListItemText } from '@mui/material';
import Explanation from '../components/Explanation';

function ArchitectureScreen() {
    return (
        <Container style={{ paddingTop: '2rem' }}>
            {/* Title Section */}
            <Typography variant="h3" align="center" gutterBottom>
                Not Only A WebSite
            </Typography>

            {/* History Section */}
            <Typography variant="h5" align="center" gutterBottom>
                Historia del proyecto
            </Typography>
            <Typography variant="body1" paragraph align="left">
                La idea en la que se basa la arquitectura de este proyecto comenzó a partir de un reto junto con un amigo.
                Teníamos que hacer una página web donde subir una canción y con el uso de IA separarla en pistas.
            </Typography>

            <Typography variant="body1" paragraph align="left">
                Esto incluía varios retos, entre ellos, el de subir un archivo de audio, procesarlo en un cliente remoto
                y devolverlo al cliente. Nos dimos cuenta de que necesitabamos una arquitectura que hiciera de estándar de
                comunicación entre el cliente y el servidor generando los roles de cliente/Worker y servidor.
            </Typography>

            <Typography variant="body1" paragraph align="left">
                Era complicado hacer que la conexión de este worker fuera confiable, escalable y basado en la resiliencia.
                Años más tarde, me decidí a afrontar el reto de monitorizar a mis mascotas haciendo uso de una nueva versión
                de esta arquitectura.
            </Typography>

            {/* History Section */}
            <Typography variant="h5" align="center" gutterBottom>
                Línea Temporal
            </Typography>
            <List dense>
                <ListItem>
                    <ListItemText
                        primary="2022"
                        secondary="@edusoto y yo compramos el dominio NetOfComputers.com para hacer referencia a este reto tecnológico y logístico"
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary="2023"
                        secondary="Primera versión estable y funcional del proyecto NetOfComps con la separación de canciones en pistas de audio"
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary="2023"
                        secondary="¡Problemas de Escalabilidad, Rendimiento y Costo! Se decide afrontar el desarrollo con una capa de abstracción para hacer el código más escalable"
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary="2023"
                        secondary="El proyecto es descontinuado por falta de recursos y tiempo"
                    />
                </ListItem>
            </List>

            {/* Overview Section */}
            <Typography variant="h5" align="center" style={{ marginTop: '2rem' }}>
                Nuevo Enfoque
            </Typography>
            <Typography variant="body1" paragraph align="left">
                A finales de este año 2024 me propuse monitorizar a mis mascotas (periquitos) que al estar fuera de mi casa suponía un reto logístico importante.
                <Typography>
                    Tenía claro que quería utilizar una Raspberry Pi con diferentes módulos de hardware para no solo ser capaz de hacer streaming de video, sino también de audio y
                    sensores externos.
                </Typography>
            </Typography>

            {/* Architecture Layers */}
            <Grid container spacing={4}>
                {/* UI/Components Layer */}
                <Grid item xs={12} sm={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                Capa de Componentes (UI)
                            </Typography>
                            <Typography variant="body1" paragraph>
                                La capa de UI está construida utilizando React con Material-UI para el estilo y el diseño. Esta capa maneja todos los componentes visuales y la lógica de interacción del usuario.
                            </Typography>
                            <List dense>
                                <ListItem>
                                    <ListItemText primary="Componentes de React" secondary="Componentes reutilizables para construir la interfaz" />
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary="Enrutamiento" secondary="React Router para navegar entre pantallas" />
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary="Material-UI" secondary="Componentes de estilo preconstruidos para una apariencia moderna y atractiva" />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Services Layer */}
                <Grid item xs={12} sm={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                Capa de Servicios (Backend/API)
                            </Typography>
                            <Typography variant="body1" paragraph>
                                La capa de servicios incluye integraciones de API y lógica para obtener datos del backend. Maneja la comunicación con APIs REST o puntos finales de GraphQL.
                            </Typography>
                            <List dense>
                                <ListItem>
                                    <ListItemText primary="API REST" secondary="Comunicación de backend para operaciones CRUD" />
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary="Manejo de Errores" secondary="Manejo y notificaciones de errores de manera elegante" />
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary="Transformación de Datos" secondary="Transformando datos de la API para el consumo en frontend" />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Data Layer */}
                <Grid item xs={12} sm={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                Capa de Datos
                            </Typography>
                            <Typography variant="body1" paragraph>
                                La capa de datos es responsable de la gestión del estado y el flujo de datos a lo largo de la aplicación. Esto incluye el estado local y global utilizando bibliotecas como Redux o Context API.
                            </Typography>
                            <List dense>
                                <ListItem>
                                    <ListItemText primary="Gestión del Estado" secondary="Estado de React o Context API para la gestión del estado" />
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary="Caché de Datos" secondary="Caché de respuestas para mejorar el rendimiento" />
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary="Flujo de Datos" secondary="Gestión de cómo se mueven los datos entre componentes y servicios" />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Deployment Layer */}
                <Grid item xs={12} sm={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                Despliegue
                            </Typography>
                            <Typography variant="body1" paragraph>
                                Este proyecto utiliza pipelines de CI/CD para asegurar un despliegue sin problemas en entornos de producción. El pipeline automatiza los procesos de pruebas, construcción y despliegue.
                            </Typography>
                            <List dense>
                                <ListItem>
                                    <ListItemText primary="Pipeline CI/CD" secondary="Pruebas, construcción y despliegue automatizados" />
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary="Contenerización" secondary="Docker para crear entornos aislados" />
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary="Alojamiento en la Nube" secondary="Desplegado en AWS/GCP/Azure con autoescalado" />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Diagram Section */}
            <Typography variant="h5" align="center" style={{ marginTop: '2rem' }}>
                Diagrama de Arquitectura
            </Typography>
            <Typography variant="body1" align="center" paragraph>
                A continuación se muestra un diagrama simplificado que ilustra cómo interactúan las diferentes capas de la arquitectura.
            </Typography>
            <img
                src="./diagrams/netofcomps/d0f0v0.png"
                alt="Diagrama de Arquitectura"
                style={{ display: 'block', margin: '0 auto', maxWidth: '100%', height: 'auto' }}
            />

            <Explanation></Explanation>

        </Container>
    );
}

export default ArchitectureScreen;
