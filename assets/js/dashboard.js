window.addEventListener("pageshow", function (event) {
    if (event.persisted) {
        window.location.reload();
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    try {

        const response = await fetch("http://127.0.0.1:8000/api/auth/me/", {
            method: "GET",
            credentials: "include"
        });

        if (response.status === 401) {
            window.location.replace("/index.html");
            return;
        }

        if (!response.ok) {
            console.error("Erro inesperado:", response.status);
            return;
        }

        const user = await response.json();
        console.log("Usuário validado:", user);

    } catch (error) {
        console.error("Erro de conexão:", error);
        window.location.replace("/index.html");
    }
});