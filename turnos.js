const formTurno = document.getElementById("form-turno");
const tablaTurnos = document.getElementById("tabla-turnos");
const total = document.getElementById("total");
const selectMascota = document.getElementById("selectMascota");
const selectVeterinario = document.getElementById("selectVeterinario");

function leerMascotas() {
    return JSON.parse(localStorage.getItem("mascotas")) || [];
}

function leerVeterinarios() {
    return JSON.parse(localStorage.getItem("veterinarios")) || [];
}

function leerTurnos() {
    return JSON.parse(localStorage.getItem("turnos")) || [];
}

function cargarSelects() {
    const mascotas = leerMascotas();
    const veterinarios = leerVeterinarios();

    selectMascota.innerHTML = '<option value="">Seleccioná una mascota</option>';
    mascotas.forEach(function (mascota) {
        selectMascota.innerHTML += `<option value="${mascota.idMascota}">${mascota.nombreMascota} (${mascota.nombreDuenio})</option>`;
    });

    selectVeterinario.innerHTML = '<option value="">Seleccioná un veterinario</option>';
    veterinarios.forEach(function (veterinario) {
        selectVeterinario.innerHTML += `<option value="${veterinario.idVeterinario}">${veterinario.nombre}</option>`;
    });
}

function mostrarTurnos() {
    const turnos = leerTurnos();

    turnos.sort(function (a, b) {
        const claveA = a.fecha + " " + a.hora;
        const claveB = b.fecha + " " + b.hora;
        return claveA.localeCompare(claveB);
    });
    const mascotas = leerMascotas();
    const veterinarios = leerVeterinarios();

    tablaTurnos.innerHTML = "";

    turnos.forEach(function (turno) {
        const mascota = mascotas.find(function (m) {
            return m.idMascota === turno.idMascota;
        });
        const veterinario = veterinarios.find(function (v) {
            return v.idVeterinario === turno.idVeterinario;
        });

        const nombreMascota = mascota ? mascota.nombreMascota : "(mascota eliminada)";
        const nombreVeterinario = veterinario ? veterinario.nombre : "(veterinario eliminado)";

        tablaTurnos.innerHTML += `
            <tr>
                <td>${turno.fecha}</td>
                <td>${turno.hora}</td>
                <td>${nombreMascota}</td>
                <td>${nombreVeterinario}</td>
                <td>${turno.motivo}</td>
                <td><button class="btn btn-sm btn-danger" data-id="${turno.idTurno}">Eliminar</button></td>
            </tr>
        `;
    });

    total.textContent = turnos.length;
}

cargarSelects();
mostrarTurnos();
const hoy = new Date();
const anio = hoy.getFullYear();
const mes = String(hoy.getMonth() + 1).padStart(2, "0");
const dia = String(hoy.getDate()).padStart(2, "0");

document.getElementById("fecha").min = anio + "-" + mes + "-" + dia;



formTurno.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const idMascota = selectMascota.value;
    const idVeterinario = selectVeterinario.value;
    const fecha = document.getElementById("fecha").value;
    const hora = document.getElementById("hora").value;
    const motivo = document.getElementById("motivo").value;

    const turnos = leerTurnos();

    const ocupado = turnos.some(function (t) {
        return t.idVeterinario === idVeterinario && t.fecha === fecha && t.hora === hora;
    });

    if (ocupado) {
        alert("Ese veterinario ya tiene un turno en esa fecha y hora.");
        return;
    }

    const turno = {
        idTurno: crypto.randomUUID(),
        idMascota: idMascota,
        idVeterinario: idVeterinario,
        fecha: fecha,
        hora: hora,
        motivo: motivo
    };

    turnos.push(turno);
    localStorage.setItem("turnos", JSON.stringify(turnos));

    mostrarTurnos();
    formTurno.reset();
});

tablaTurnos.addEventListener("click", function (evento) {
    const boton = evento.target;

    if (boton.classList.contains("btn-danger")) {
        const id = boton.dataset.id;

        const confirmar = confirm("¿Seguro que querés eliminar este turno?");

        if (confirmar) {
            const turnos = leerTurnos();

            const filtrados = turnos.filter(function (t) {
                return t.idTurno !== id;
            });

            localStorage.setItem("turnos", JSON.stringify(filtrados));
            mostrarTurnos();
        }
    }
});