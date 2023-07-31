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
        const respuesta =  await fetch('http://localhost:3000/usuario', opciones)
        
        if (respuesta.ok){
            if(nombre != "" && balance != ""){
                nuevoNombre.value = ''
                nuevoBalance.value = ''
                Swal.fire({
                    icon: 'success',
                    html: 'Tu usuario ha sido creado exitosamente'
                })
                await actualizarDOM()
            }
            else {
                Swal.fire({
                    icon: 'error',
                    html: 'Debes ingresar un nombre de usuario y Balance'
                })
            }
        }
        
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

        if (respuesta.ok){
            if(monto != ""){
                DOMmonto.value = "";

                Swal.fire({
                    icon: 'success',
                    html: 'Tu transferencia se ha realizado exitosamente'
                })
                actualizarDOM()
            }
            else {
                Swal.fire({
                    icon: 'error',
                    html: 'Debes ingresar el monto para realizar la transferencia'
                })
            }
        }

    } catch (error) {
        console.log('Error ===== >', error)
    }
}

// ======================================================================================= MOSTRAR TODOS LOS USUARIOS
async function actualizarDOM() {
    try {
        const todosLosUsuarios = await fetch(`http://localhost:3000/usuarios`);
        const listado = await todosLosUsuarios.json();

        DOMemisor.innerHTML = ''
        DOMreceptor.innerHTML = ''

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
            DOMemisor.innerHTML += `<option value="${element.nombre}">${element.nombre}</option>`
        });

        listado.forEach(element => {
            DOMreceptor.innerHTML += `<option value="${element.nombre}">${element.nombre}</option>`
        });

    } catch (error) {
        console.log(error);
    }
}

// ======================================================================== CREAR TABLAS SI ES QUE AÚN NO EXISTEN
async function crearTablas() {
    try {
        await fetch(`http://localhost:3000/tablas`);
        await actualizarDOM()
    } catch (error) {
        console.log(error);
    }
}

crearTablas()