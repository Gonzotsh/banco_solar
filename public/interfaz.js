window.addEventListener('load', function () {
    document.getElementById('nuevoUsuario').addEventListener('click', nuevoUsuario)
    document.getElementById('nuevaTransferencia').addEventListener('click', nuevaTransferencia)

    
    //document.getElementById('revisarUsuario').addEventListener('click', loginUsuario)
})

//Agregar Usuario
let nuevoNombre = document.querySelector('#nuevoNombre');
let nuevoBalance = document.querySelector('#nuevoBalance');

//Mostrar usuarios en tabla
let tablaUsuarios = document.querySelector('#tablaUsuarios');

//Lista de usuarios en tabla de transferencia
let DOMemisor = document.querySelector('#DOMemisor')
let DOMreceptor = document.querySelector('#DOMreceptor')

let DOMmonto = document.querySelector('#DOMmonto')



// =================================================================================== NUEVO USUARIO
async function nuevoUsuario(e) {
    e.preventDefault();
    let nombre = nuevoNombre.value,
        balance = nuevoBalance.value

    try {
        const opciones = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, balance })
        };
        await fetch('http://localhost:3000/usuario', opciones)
        actualizarDOM()
        nuevoNombre.value = ""
        nuevoBalance.value = ""
        Swal.fire({
            icon: 'success',
            html: 'Tu usuario ha sido creado exitosamente'
        })
    } catch (error) {
        console.log('Error ===== >', error)
    }
}


// =================================================================================== NUEVA TRANSFERENCIA
async function nuevaTransferencia(e) {
    e.preventDefault();
    let emisor = DOMemisor.value,
        receptor = DOMreceptor.value,
        monto = DOMmonto.value

    try {
        const opciones = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ emisor, receptor, monto })
        };
        await fetch('http://localhost:3000/transferencia', opciones)

        DOMmonto.value = "";

        Swal.fire({
            icon: 'success',
            html: 'Tu transferencia se realizó correctamente'
        })
    } catch (error) {
        console.log('Error ===== >', error)
    }
}


async function actualizarDOM() {
    try {
        const todosLosUsuarios = await fetch(`http://localhost:3000/usuarios`);
        const listado = await todosLosUsuarios.json();


        DOMemisor.innerHTML = ""
        DOMreceptor.innerHTML = ""

        tablaUsuarios.innerHTML = `
        <thead class="bg-danger text-white">
          <th>Nombre</th>
          <th>Balance</th>
        </thead>
        <tbody class="usuarios">
          ${listado
                .map((element) => `
              <tr>
                <td>${element.nombre}</td>
                <td>${element.balance}</td>
              </tr>
            `)
                .join('')}
        </tbody>
      `;

        listado.forEach(element => {
            DOMemisor.innerHTML += `
                <option value="${element.nombre}">${element.nombre}</option>
            `
        });

        listado.forEach(element => {
            DOMreceptor.innerHTML += `
                <option value="${element.nombre}">${element.nombre}</option>
            `
        });

    } catch (error) {
        console.log(error);
    }
}






// =================================================================================== LOGIN USUARIO
async function loginUsuario(e) {
    e.preventDefault();
    let email = buscarEmail.value, contrasena = buscarContrasena.value
    if (email != '' && contrasena != '') {
        try {
            const resultado = await fetch(`http://localhost:3000/usuario/${email}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ contrasena }) // Enviar la contraseña en el cuerpo de la solicitud
            })
            if (resultado.ok) {
                const usuario = await resultado.json()
                DomUsuarioDatos.innerHTML = `Bienvenido nuevamente ${usuario[0].nombre}. Esta es la lista de usuarios creados<br><br>`
                try {
                    const todosLosUsuarios = await fetch(`http://localhost:3000/usuarios`)
                    const listado = await todosLosUsuarios.json()
                    tablaUsuarios.innerHTML = `
                    <thead>
                        <tr>
                        <th scope="col">Nombre</th>
                        <th scope="col">Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <th scope="row">1</th> `

                    listado.forEach(element => {
                        tablaUsuarios.innerHTML += `
                            <td>${element.nombre}</td>
                            <td>${element.email}</td>`
                    });

                    tablaUsuarios.innerHTML += `
                    </tr>
                    </tbody>`
                } catch (error) {
                    console.log(error)
                }
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    html: 'Contraseña incorrecta<br>Favor verificar los datos'
                })
            }
        } catch (error) {
            console.log("Error imprimiento", error)
        }
    }
    else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            html: 'Debes ingresar email y contraseña'
        })
    }
}

actualizarDOM()
