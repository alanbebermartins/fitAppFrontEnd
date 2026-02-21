document.addEventListener("DOMContentLoaded", () => {

    const logoutButton = document.getElementById("logoutButton");

    if (!logoutButton) return;

    logoutButton.addEventListener("click", async (event) => {

        event.preventDefault();
        logoutButton.disabled = true;

        try {

            await fetch("http://127.0.0.1:8000/api/auth/logout/", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                }
            });

        } catch (error) {
            console.error("Erro ao fazer logout:", error);
        }

        // 🔥 Limpa qualquer possível estado local
        sessionStorage.clear();
        localStorage.clear();

        // 🔥 Remove do histórico (não permite voltar)
        window.location.replace("/index.html");

    });

});
