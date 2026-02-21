document.addEventListener('DOMContentLoaded', function() {

    const loginButton = document.getElementById('loginButton');
    const userEmailInput = document.getElementById('userEmail');
    const userPasswordInput = document.getElementById('userPassword');

    const errorMessageUserEmail = document.getElementById('errorMessageUserEmail');
    const errorMessageUserPassword = document.getElementById('errorMessageUserPassword');
    const errorMessageForm = document.getElementById('errorMessageForm');
    const registerUser = document.getElementById('registerUser');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const registerUserName = document.getElementById('registerUserName');
    const errorMessageRegisterUserName = document.getElementById('errorMessageRegisterUserName');
    const registerUserLastName = document.getElementById('registerUserLastName');
    const errorMessageRegisterUserLastName = document.getElementById('errorMessageRegisterUserLastName');
    const registerUserEmail = document.getElementById('registerUserEmail');
    const errorMessageRegisterUserEmail = document.getElementById('errorMessageRegisterUserEmail');
    const registerUserPassword = document.getElementById('registerUserPassword');
    const errorMessageRegisterUserPassword = document.getElementById('errorMessageRegisterUserPassword');
    const errorMessageRegisterForm = document.getElementById('errorMessageRegisterForm');
    const registerButton = document.getElementById('registerButton');

    // Validação formato de email
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Validação de inputs
    function validateInputs(userEmail, userPassword) {
        let hasError = false;

        if (userEmail === '') {
            errorMessageUserEmail.style.display = "block";
            errorMessageUserEmail.textContent = "Campo obrigatório";
            hasError = true;
        } else {
            errorMessageUserEmail.style.display = "none";
        }

        if (userPassword === '') {
            errorMessageUserPassword.style.display = "block";
            errorMessageUserPassword.textContent = "Campo obrigatório";
            hasError = true;
        } else {
            errorMessageUserPassword.style.display = "none";
        }

        return hasError;
    }

    loginButton.addEventListener('click', async function(event) {
        event.preventDefault();

        const userEmail = userEmailInput.value.trim();
        const userPassword = userPasswordInput.value.trim();

        errorMessageForm.style.display = "none";
        errorMessageForm.innerHTML = "";

        if (validateInputs(userEmail, userPassword)) return;

        if (!validateEmail(userEmail)) {
            errorMessageUserEmail.textContent = "Email inválido";
            errorMessageUserEmail.style.display = "block";
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:8000/api/auth/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    email: userEmail, // SIMPLEJWT usa username
                    password: userPassword
                })
            });
            console.log('RETORNO DO RESPONSE = ',response)

            if (!response.ok) {
                errorMessageForm.style.display = "block";
                errorMessageForm.innerHTML = "Email ou senha incorretos!";
                return;
            }

            const data = await response.json();

            localStorage.setItem("access_token", data.access);
            localStorage.setItem("refresh_token", data.refresh);

            window.location.href = "/dashboard.html";

        } catch (error) {
            console.error("Erro de conexão:", error);

            errorMessageForm.style.display = "block";
            errorMessageForm.innerHTML = "Erro ao conectar no servidor!";
        }

        userEmailInput.value = "";
        userPasswordInput.value = "";
    });

    userEmailInput.addEventListener('input', function() {
        const email = userEmailInput.value.trim();

        if (email !== '' && validateEmail(email)) {
            errorMessageUserEmail.style.display = "none";
        } else if (email === '') {
            errorMessageUserEmail.textContent = "Campo obrigatório";
            errorMessageUserEmail.style.display = "block";
        } else {
            errorMessageUserEmail.textContent = "Email inválido";
            errorMessageUserEmail.style.display = "block";
        }
    });

    userPasswordInput.addEventListener('input', function() {
        const password = userPasswordInput.value.trim();

        if (password !== '') {
            errorMessageUserPassword.style.display = "none";
        } else {
            errorMessageUserPassword.textContent = "Campo obrigatório";
            errorMessageUserPassword.style.display = "block";
        }
    });

    // Validação de inputs formulário de cadastro de ususário

    function validateInputsRegisterForm(registerUserNameValue, registerUserLastNameValue, registerUserEmailValue, registerUserPasswordValue) {
        let hasError = false;

        if (registerUserNameValue === '') {
            errorMessageRegisterUserName.style.display = "block";
            errorMessageRegisterUserName.textContent = "Campo obrigatório";
            hasError = true;
        } else {
            errorMessageRegisterUserName.style.display = "none";
        }

        if (registerUserLastNameValue === '') {
            errorMessageRegisterUserLastName.style.display = "block";
            errorMessageRegisterUserLastName.textContent = "Campo obrigatório";
            hasError = true;
        } else {
            errorMessageRegisterUserLastName.style.display = "none";
        }

        if (registerUserEmailValue === '') {
            errorMessageRegisterUserEmail.style.display = "block";
            errorMessageRegisterUserEmail.textContent = "Campo obrigatório";
            hasError = true;
        } else {
            errorMessageRegisterUserEmail.style.display = "none";
        }

        if (registerUserPasswordValue === '') {
            errorMessageRegisterUserPassword.style.display = "block";
            errorMessageRegisterUserPassword.textContent = "Campo obrigatório";
            hasError = true;
        } else {
            errorMessageRegisterUserPassword.style.display = "none";
        }

        return hasError
    }

    registerUser.addEventListener('click', (event) => {
        event.preventDefault()
        console.log('botao de cadastrar clicado')

        loginForm.classList.add('d-none');
        registerForm.classList.remove('d-none')
    })

    registerButton.addEventListener('click', async function(event) {
        event.preventDefault()
        console.log('botao de cadastrar usuario clicado')
        const userNameValue = registerUserName.value.trim();
        const userLastNameValue = registerUserLastName.value.trim();
        const registerUserEmailValue = registerUserEmail.value.trim();
        const registerUserPasswordValue = registerUserPassword.value.trim();

        // validateInputsRegisterForm(userNameValue, userLastNameValue, registerUserEmailValue, registerUserPasswordValue)
        if (validateInputsRegisterForm(userNameValue, userLastNameValue, registerUserEmailValue, registerUserPasswordValue)) return;

        if (!validateEmail(registerUserEmailValue)) {
            errorMessageRegisterUserEmail.textContent = "Email inválido";
            errorMessageRegisterUserEmail.style.display = "block";
            return;
        }


        // ---\/---START - BLOCO TRY CATCH DA API DE CADASTRAR ---\/---

        try {
            const response = await fetch("http://127.0.0.1:8000/api/auth/register/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    first_name: userNameValue,
                    last_name: userLastNameValue,
                    email: registerUserEmailValue,
                    password: registerUserPasswordValue
                })
            });
            console.log('RETORNO DO RESPONSE CADASTRAR USUÁRIO = ',response)

            if (!response.ok) {
                errorMessageRegisterForm.style.display = "block";
                errorMessageRegisterForm.innerHTML = "Nome, Sobrenome, Email ou Senha não foram cadastrados!";
                return;
            }
            
        } catch (error) {
            console.error("Erro de conexão:", error);

            errorMessageRegisterForm.style.display = "block";
            errorMessageRegisterForm.innerHTML = "Erro ao conectar no servidor!";
            
        }


        // ---/\---END - BLOCO TRY CATCH DA API DE CADASTRAR ---/\---

        registerUserName.value = "";
        registerUserLastName.value = "";
        registerUserEmail.value = "";
        registerUserPassword.value = "";
        
        loginForm.classList.remove('d-none');
        registerForm.classList.add('d-none')
    })

    registerUserName.addEventListener('input', function() {
        const usernFirstName = registerUserName.value.trim();

        if (usernFirstName !== '') {
            errorMessageRegisterUserName.style.display = "none";
        } else {
            errorMessageRegisterUserName.textContent = "Campo obrigatório";
            errorMessageRegisterUserName.style.display = "block";
        }
    });

    registerUserLastName.addEventListener('input', function() {
        const userLastName = registerUserLastName.value.trim();

        if (userLastName !== '') {
            errorMessageRegisterUserLastName.style.display = "none";
        } else {
            errorMessageRegisterUserLastName.textContent = "Campo obrigatório";
            errorMessageRegisterUserLastName.style.display = "block";
        }
    });

    registerUserEmail.addEventListener('input', function() {
        const email = registerUserEmail.value.trim();

        if (email !== '' && validateEmail(email)) {
            errorMessageRegisterUserEmail.style.display = "none";
        } else if (email === '') {
            errorMessageRegisterUserEmail.textContent = "Campo obrigatório";
            errorMessageRegisterUserEmail.style.display = "block";
        } else {
            errorMessageRegisterUserEmail.textContent = "Email inválido";
            errorMessageRegisterUserEmail.style.display = "block";
        }
    });

    registerUserPassword.addEventListener('input', function() {
        const password = registerUserPassword.value.trim();

        if (password !== '') {
            errorMessageRegisterUserPassword.style.display = "none";
        } else {
            errorMessageRegisterUserPassword.textContent = "Campo obrigatório";
            errorMessageRegisterUserPassword.style.display = "block";
        }
    });


});
