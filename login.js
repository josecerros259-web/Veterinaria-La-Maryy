const formLogin = document.getElementById("form-login");
const mensajeError = document.getElementById("mensaje-error");

formLogin.addEventListener("submit", async function (evento) {
    evento.preventDefault();
    mensajeError.classList.add("d-none");

    const username = document.getElementById("usuario").value;
    const password = document.getElementById("password").value;

    try {
        const respuesta = await fetch("https://dummyjson.com/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const datos = await respuesta.json();
        console.log(datos);

        if (!respuesta.ok) {
            mostrarError("Usuario o contraseña incorrectos.");
            return;
        }

        sessionStorage.setItem("token", datos.accessToken);
        sessionStorage.setItem("usuario", datos.username);

        window.location.href = "mascotas.html";

    } catch (error) {
        mostrarError("No se pudo conectar con el servidor. Probá de nuevo.");
    }
});

function mostrarError(texto) {
    mensajeError.textContent = texto;
    mensajeError.classList.remove("d-none");
}