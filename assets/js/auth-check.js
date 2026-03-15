(function () {

    fetch("http://127.0.0.1:8000/api/auth/check/", {
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