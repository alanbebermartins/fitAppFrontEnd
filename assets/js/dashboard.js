document.addEventListener("DOMContentLoaded", async () => {

    try {
        const response = await fetch("http://127.0.0.1:8000/api/auth/me/", {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            window.location.href = "/index.html";
            return;
        }

        const user = await response.json();
        console.log("Usuário logado:", user);

    } catch (error) {
        console.error("Erro ao validar sessão:", error);
        window.location.href = "/index.html";
    }

});
