import express from 'express';
import {agregaUsuario, verUsuarioPorEmail,verTodosLosUsuarios , realizaTransferencia} from './consultas.js';


import { fileURLToPath } from 'url'
import { dirname, join } from "path";

const __filename = fileURLToPath( import.meta.url )
const __dirname = dirname( __filename );

const app = express();
app.use(express.json());

// Servir los archivos estáticos desde la carpeta "public"
app.use(express.static(join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'public', 'index.html'));
  });
  

// ====================================================================================         AGREGAR USUARIO
app.post('/usuario', async (req, res) => {
    const { nombre, balance } = req.body;
    try {
        const usuario = await agregaUsuario(nombre, balance);
        res.json(usuario)
    } catch (error) {
        console.error('Error al intentar agregar un nuevo usuario:', error);
    }
});


// ====================================================================================         REALIZAR TRANSFERENCIA
app.post('/transferencia', async (req, res) => {
    const { emisor, receptor, monto } = req.body;
    console.log("Hola")
    try {
        const transferencia = await realizaTransferencia(emisor, receptor, monto);
        res.json(transferencia)
    } catch (error) {
        console.error('Error al intentar realizar una transferencia:', error);
    }
});



// ====================================================================================        VER TODOS LOS USUARIOS
app.get('/usuarios', async (req, res) => {
    try {
        const usuario = await verTodosLosUsuarios();
        res.json(usuario)
    } catch (error) {
        console.error('Error al intentar mostrar todos los usuarios:', error);
    }
});

app.listen(3000, () => {
    console.log(`Servidor listo en puerto 3000`);
});











// ====================================================================================        LOGIN USUARIO POR MAIL
app.post('/usuario/:email', async (req, res) => {
    const email = req.params.email;
    const {contrasena} = req.body;
    try {
        const usuario = await verUsuarioPorEmail(email);
        if (usuario && usuario[0].contrasena === contrasena) {
            res.json(usuario);
          } else {
            res.status(401).send('Contraseña incorrecta o usuario no encontrado');
          }
    } catch (error) {
        console.error('Error al intentar mostrar todos los estudiantes:', error);
    }
});


