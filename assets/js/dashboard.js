document.addEventListener("DOMContentLoaded", async () => {
    try {

        const response = await fetch(`${API_BASE_URL}/api/auth/me/`, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            console.error("Erro inesperado:", response.status);
            window.location.href = "/login";
            return;
        }

        const user = await response.json();

    } catch (error) {
        console.error("Erro de conexão:", error);
        window.location.replace("/login");
    }
});