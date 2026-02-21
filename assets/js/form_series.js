document.addEventListener('DOMContentLoaded', function() {

    function gerarUUID() {
        // Método moderno (RFC 4122 UUID v4)
        if (typeof crypto !== "undefined" && crypto.randomUUID) {
            return crypto.randomUUID();
        }

        // Fallback (também RFC 4122 UUID v4)
        if (typeof crypto !== "undefined" && crypto.getRandomValues) {
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            const r = crypto.getRandomValues(new Uint8Array(1))[0] & 15;
            const v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
            });
        }

        // Último fallback (NÃO recomendado, mas evita quebrar o sistema)
        let d = new Date().getTime();
        let d2 = (performance && performance.now && performance.now() * 1000) || 0;

        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            let r = Math.random() * 16;

            if (d > 0) {
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
            } else {
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
            }

            return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
        });
    }

    const exercizeList = [
        {excersizeId:`${gerarUUID()}`,exersizeName:'Supino Reto'},
        {excersizeId:`${gerarUUID()}`,exersizeName:'Supino Incliado'},
        {excersizeId:`${gerarUUID()}`,exersizeName:'Voador na máquina'},
        {excersizeId:`${gerarUUID()}`,exersizeName:'Manguito'},
    ]

    // Inputs do DOM
    const saveSendReps = document.getElementById('saveSendReps');
    const idExercise = 2; // ID fixo, você pode mudar dinamicamente
    const weight = document.getElementById('weight');
    const firstSetReps = document.getElementById('firstSetReps');
    const secondSetReps = document.getElementById('secondSetReps');
    const thirdSetReps = document.getElementById('thirdSetReps');
    const fourthSetReps = document.getElementById('fourthSetReps');
    const fieldRepsError = document.getElementById('fieldRepsError');
    const selectExercise = document.getElementById('selectExercise');
    let uuidSelecionado = null;


    exercizeList.forEach(item => {
        let option = new Option(item.exersizeName, item.excersizeId);
        selectExercise.add(option)
    })

    selectExercise.addEventListener("change", function () {
        uuidSelecionado = selectExercise.value; // pega SOMENTE o value da opção atual selecionada

        console.log("UUID selecionado:", uuidSelecionado);

        // Se quiser pegar o texto da opção selecionada também:
        const textoSelecionado = selectExercise.options[selectExercise.selectedIndex].text;
        console.log("Texto selecionado:", textoSelecionado);
    });


    
    // Ao clicar no botão
    saveSendReps.addEventListener('click', function(event) {
        event.preventDefault();

        // Verifica se todos os campos estão preenchidos
        if (weight.value && firstSetReps.value && secondSetReps.value && thirdSetReps.value && fourthSetReps.value && selectExercise.value) {

            // Cria objeto treino
            const treino = {
                exercise_id: uuidSelecionado,
                weight_kg: Number(weight.value),
                first_set_reps: Number(firstSetReps.value),
                second_set_reps: Number(secondSetReps.value),
                third_set_reps: Number(thirdSetReps.value),
                fourth_set_reps: Number(fourthSetReps.value),
                training_date: new Date().toISOString().slice(0, 10) // YYYY-MM-DD
            };

            // Envia para a API Django
            fetch("http://127.0.0.1:8000/api/training/register/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("access_token")
                },
                credentials: "include",
                body: JSON.stringify(treino)
            })
            .then(response => {
                if (!response.ok) {
                    // Se o Django retornar erro, tenta ler a mensagem
                    return response.json().then(err => { throw new Error(JSON.stringify(err)) });
                }
                return response.json();
            })
            .then(data => {
                console.log("Treino salvo com sucesso:", data);
                // Opcional: limpar inputs após envio
                weight.value = '';
                firstSetReps.value = '';
                secondSetReps.value = '';
                thirdSetReps.value = '';
                fourthSetReps.value = '';
                fieldRepsError.style.display = ''
                selectExercise.value = "";
            })
            .catch(error => {
                console.error("Erro ao salvar treino:", error);
            });

        } else {
            console.warn("Todos os campos devem ser preenchidos!");
            fieldRepsError.innerText = 'Campos(s) Obrigatório(s)'
            fieldRepsError.style.display = 'block'
        }

    });

});

