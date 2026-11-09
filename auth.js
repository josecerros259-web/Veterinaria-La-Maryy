function haySesion() {
    return sessionStorage.getItem("token") !== null;
}

function cerrarSesion() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("usuario");
    window.location.href = "login.html";
}

function actualizarMenu() {
    const conSesion = haySesion();

    document.querySelectorAll(".solo-admin").forEach(function (elemento) {
        elemento.classList.toggle("d-none", !conSesion);
    });

    document.querySelectorAll(".solo-visitante").forEach(function (elemento) {
        elemento.classList.toggle("d-none", conSesion);
    });
}

function protegerPagina() {
    const esProtegida = document.body.dataset.protegida !== undefined;

    if (esProtegida && !haySesion()) {
        window.location.href = "login.html";
    }
}

protegerPagina();
actualizarMenu();

const botonLogout = document.getElementById("btn-logout");

if (botonLogout) {
    botonLogout.addEventListener("click", function (evento) {
        evento.preventDefault();
        cerrarSesion();
    });
}