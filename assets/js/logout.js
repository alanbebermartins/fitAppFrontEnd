document.addEventListener("DOMContentLoaded", () => {

    const logoutButton = document.getElementById("logoutButton");

    logoutButton.addEventListener("click", async () => {

        await fetch("http://127.0.0.1:8000/api/auth/logout/", {
            method: "POST",
            credentials: "include"
        });

        window.location.href = "/index.html";
    });

});
