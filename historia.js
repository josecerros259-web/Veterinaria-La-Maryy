const formHistoria = document.getElementById("form-historia");
const tablaHistorias = document.getElementById("tabla-historias");
const total = document.getElementById("total");
const selectMascota = document.getElementById("selectMascota");
const selectVeterinario = document.getElementById("selectVeterinario");
const selectHistorial = document.getElementById("selectHistorial");
const contenedorHistorial = document.getElementById("historial");

function leerMascotas() {
    return JSON.parse(localStorage.getItem("mascotas")) || [];
}

function leerVeterinarios() {
    return JSON.parse(localStorage.getItem("veterinarios")) || [];
}

function leerHistorias() {
    return JSON.parse(localStorage.getItem("historias")) || [];
}

function nombreMascota(id) {
    const mascota = leerMascotas().find(function (m) {
        return m.idMascota === id;
    });
    return mascota ? mascota.nombreMascota : "(mascota eliminada)";
}

function nombreVeterinario(id) {
    const veterinario = leerVeterinarios().find(function (v) {
        return v.idVeterinario === id;
    });
    return veterinario ? veterinario.nombre : "(veterinario eliminado)";
}

function fechaHoy() {
    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");
    return anio + "-" + mes + "-" + dia;
}

function cargarSelects() {
    const mascotas = leerMascotas();
    const veterinarios = leerVeterinarios();

    selectMascota.innerHTML = '<option value="">Seleccioná una mascota</option>';
    selectHistorial.innerHTML = '<option value="">Seleccioná una mascota</option>';

    mascotas.forEach(function (mascota) {
        const opcion = `<option value="${mascota.idMascota}">${mascota.nombreMascota} (${mascota.nombreDuenio})</option>`;
        selectMascota.innerHTML += opcion;
        selectHistorial.innerHTML += opcion;
    });

    selectVeterinario.innerHTML = '<option value="">Seleccioná un veterinario</option>';
    veterinarios.forEach(function (veterinario) {
        selectVeterinario.innerHTML += `<option value="${veterinario.idVeterinario}">${veterinario.nombre}</option>`;
    });
}

function mostrarHistorias() {
    const historias = leerHistorias();

    historias.sort(function (a, b) {
        return b.fecha.localeCompare(a.fecha);
    });

    tablaHistorias.innerHTML = "";

    historias.forEach(function (historia) {
        tablaHistorias.innerHTML += `
            <tr>
                <td>${historia.fecha}</td>
                <td>${nombreMascota(historia.idMascota)}</td>
                <td>${nombreVeterinario(historia.idVeterinario)}</td>
                <td>${historia.diagnostico}</td>
                <td>${historia.tratamiento}</td>
            </tr>
        `;
    });

    total.textContent = historias.length;
}

function mostrarHistorial() {
    const idMascota = selectHistorial.value;

    if (idMascota === "") {
        contenedorHistorial.innerHTML = '<p class="text-muted">Elegí una mascota para ver su historial.</p>';
        return;
    }

    const registros = leerHistorias().filter(function (h) {
        return h.idMascota === idMascota;
    });

    if (registros.length === 0) {
        contenedorHistorial.innerHTML = '<p class="text-muted">Esta mascota todavía no tiene registros.</p>';
        return;
    }

    registros.sort(function (a, b) {
        return b.fecha.localeCompare(a.fecha);
    });

    contenedorHistorial.innerHTML = "";

    registros.forEach(function (h) {
        let extras = "";

        if (h.peso !== null) {
            extras += `<span class="badge text-bg-light border me-1">Peso: ${h.peso} kg</span>`;
        }
        if (h.temperatura !== null) {
            extras += `<span class="badge text-bg-light border me-1">Temperatura: ${h.temperatura} °C</span>`;
        }
        if (h.proximoControl) {
            extras += `<span class="badge text-bg-light border me-1">Próximo control: ${h.proximoControl}</span>`;
        }

        contenedorHistorial.innerHTML += `
            <div class="card mb-3">
                <div class="card-body">
                    <h5 class="card-title">${h.fecha} · ${nombreVeterinario(h.idVeterinario)}</h5>
                    <p class="mb-1"><strong>Diagnóstico:</strong> ${h.diagnostico}</p>
                    <p class="mb-2"><strong>Tratamiento:</strong> ${h.tratamiento}</p>
                    ${extras}
                </div>
            </div>
        `;
    });
}

formHistoria.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const idMascota = selectMascota.value;
    const pesoTexto = document.getElementById("peso").value;
    const temperaturaTexto = document.getElementById("temperatura").value;

    const historia = {
        idHistoria: crypto.randomUUID(),
        idMascota: idMascota,
        idVeterinario: selectVeterinario.value,
        fecha: document.getElementById("fecha").value,
        diagnostico: document.getElementById("diagnostico").value,
        tratamiento: document.getElementById("tratamiento").value,
        peso: pesoTexto === "" ? null : parseFloat(pesoTexto),
        temperatura: temperaturaTexto === "" ? null : parseFloat(temperaturaTexto),
        proximoControl: document.getElementById("proximoControl").value
    };

    const historias = leerHistorias();
    historias.push(historia);
    localStorage.setItem("historias", JSON.stringify(historias));

    formHistoria.reset();
    mostrarHistorias();

    selectHistorial.value = idMascota;
    mostrarHistorial();
});

selectHistorial.addEventListener("change", mostrarHistorial);

document.getElementById("fecha").max = fechaHoy();
document.getElementById("proximoControl").min = fechaHoy();

cargarSelects();
mostrarHistorias();
mostrarHistorial();