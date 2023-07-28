import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'banco_solar',
    password: '123456',
    port: 5432,
    max: 20,
    idleTimeoutMillis: 5000,
    connectTimeoutMillis: 2000,
});


// ===================================================================================  QUERY ----- AGREGAR USUARIO
export async function agregaUsuario(nombre, balance) {
    pool.connect(async (err, client, release) => {
        if (err) {
            console.error('Error al conectar con la base de datos:', err.message, err.code);
            return;
        }
        const queryNuevoUsuario = {
            name: 'ConsultaAgregar',
            text: 'INSERT INTO usuarios (nombre, balance) VALUES ($1, $2)',
            values: [nombre, balance]
        };

        try {
            const res = await client.query(queryNuevoUsuario);
            release();
        } catch (error) {
            console.error(`Error al intentar agregar un nuevo usuario: ${error.message}, Código de error: ${error.code}`);
            release();
        }
    });
};


// ===================================================================================  QUERY ----- NUEVA TRANSFERENCIA
export async function realizaTransferencia(emisor, receptor, monto) {
    pool.connect(async (err, client, release) => {
        if (err) {
            console.error('Error al conectar con la base de datos:', err.message, err.code);
            return;
        }
        const queryNuevaTransferencia = {
            name: 'realizarTransferencia',
            text: 'INSERT INTO transferencias (emisor, receptor, monto) VALUES ($1, $2, $3)',
            values: [emisor, receptor, monto]
        };

        try {
            const res = await client.query(queryNuevaTransferencia);
            release();
        } catch (error) {
            console.error(`Error al intentar hacer una nueva transferencia: ${error.message}, Código de error: ${error.code}`);
            release();
        }
    });
};


// ===================================================================================  QUERY ---- VER TODOS LOS USUARIOS
export async function verTodosLosUsuarios() {
    return new Promise((resolve, reject) => {
        pool.connect((err, client, release) => {
            if (err) {
                console.error('Error al conectar con la base de datos:', err.message, err.code);
                reject(err);
                return;
            }

            const queryMostrarUsuarios = {
                name: 'ConsultaMostrar',
                text: 'SELECT * FROM usuarios',
                rowMode: 'array',
            };

            client.query(queryMostrarUsuarios)
                .then(res => {
                    const usuarios = res.rows.map(([id, nombre, balance]) => ({ id, nombre, balance }));
                    release();
                    resolve(usuarios);
                })
                .catch(error => {
                    console.error(`Error al intentar mostrar todos los estudiantes: ${error.message}, Código de error: ${error.code}`);
                    release();
                    reject(error);
                });
        });
    });
}












// ===================================================================================  QUERY --------- BUSCAR USUARIO
export async function verUsuarioPorEmail(email) {
    return new Promise((resolve, reject)=>{
        pool.connect(async (err, client, release) => {
            if (err) {
                console.error('Error al conectar con la base de datos:', err.message, err.code);
                return;
            }
    
            const queryConsultaEmail = {
                name: 'consultaEmail',
                text: 'SELECT * FROM usuarios WHERE email = $1',
                rowMode: 'array',
            };
            const values = [email];
    
            client.query(queryConsultaEmail, values)
                .then(res => {
                    const usuario = res.rows.map(([ nombre, email, contrasena ]) => ({ nombre, email, contrasena }));
                    release();
                    resolve(usuario);
                })
                .catch(error => {
                    console.error(`Error al intentar mostrar todos los estudiantes: ${error.message}, Código de error: ${error.code}`);
                    release();
                    reject(error);
                });
        });
    })
    
};

