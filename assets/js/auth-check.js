(function () {

    fetch(`${API_BASE_URL}/api/auth/check/`, {
        method: "GET",
        credentials: "include"
    })
    .then(function(response) {

        if (response.status !== 200) {
            window.location.replace("/");
        }

    })
    .catch(function() {
        window.location.replace("/");
    });

})();