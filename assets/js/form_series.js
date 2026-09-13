document.addEventListener('DOMContentLoaded', function() {

    // --------- BUSCAR CATEGORIAS DE GRUPOS MUSCULARES --------------

    const exerciseSelect = document.getElementById('exerciseSelect');
    
    function getCategories() {
        return fetch("http://127.0.0.1:8000/api/get_list_all_muscle_groups/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        })
        .then(function(response) { 
            return response.json().then(function(data) {
                return { status: response.status, data: data };
            });
        })
        .catch(function(error) {
            console.error("ERRO FETCH:", error);
        });
    }

    // ----- BUSCAR EXERCÍCIOS ---------------------
    
    function getExercises() {
        
        return fetch("http://127.0.0.1:8000/api/get_list_all_exercises/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        })
        .then(function(response) {
            return response.json().then(function(data) {
                return { status: response.status, data: data };
            });
        })
        .catch(function(error) {
            console.error("ERRO FETCH:", error);
        });

    }

    getCategories().then(function(result) {
        // Popula o select com os grupos musculares
        const listMuscleGroup = result && result.data ? result.data : [];
        const selectMuscleGroup = document.getElementById('selectMuscleGroup');

        listMuscleGroup.forEach(function(item) {
            let option = new Option(item.muscle_group, item.muscle_group);
            selectMuscleGroup.add(option);
        });

        selectMuscleGroup.addEventListener('change', function() {
            const selectedOption = selectMuscleGroup.options[selectMuscleGroup.selectedIndex];
            if (!selectedOption) {
                return;
            }

            const selectedText = selectedOption.textContent;

            exerciseSelect.innerHTML = '';

            getExercises().then(function(result) {
                // Popula o select com os exercícios filtrados pelo grupo muscular selecionado
                const listExercises = result && result.data ? result.data : [];
                const filteredExercisesList = listExercises
                    .filter(item => item.muscle_group === selectedText)
                    .sort((a, b) => a.exercise_name.localeCompare(b.exercise_name));

                filteredExercisesList.forEach(function(item) {
                    let option = new Option(item.exercise_name, item.uuid_exercise_id);
                    exerciseSelect.add(option);
                });
            });
        });
    });

    // Inputs do DOM
    const saveSendReps = document.getElementById('saveSendReps');
    const weight = document.getElementById('weight');
    const firstSetReps = document.getElementById('firstSetReps');
    const secondSetReps = document.getElementById('secondSetReps');
    const thirdSetReps = document.getElementById('thirdSetReps');
    const fourthSetReps = document.getElementById('fourthSetReps');
    const fieldRepsError = document.getElementById('fieldRepsError');
    const selectExercise = document.getElementById('selectExercise');

    let uuidSelecionado = null;

    exerciseSelect.addEventListener("change", function () {
        uuidSelecionado = exerciseSelect.value; // pega SOMENTE o value da opção atual selecionada

        // Se quiser pegar o texto da opção selecionada também:
        const textoSelecionado = exerciseSelect.options[exerciseSelect.selectedIndex].text;
    });
    
    // Ao clicar no botão
    saveSendReps.addEventListener('click', function(event) {
        event.preventDefault();
        const selectMuscleGroup = document.getElementById('selectMuscleGroup');
        // Verifica se todos os campos estão preenchidos
        if (weight.value && firstSetReps.value && secondSetReps.value && thirdSetReps.value && fourthSetReps.value && exerciseSelect.value) {

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
                // Opcional: limpar inputs após envio
                weight.value = '';
                firstSetReps.value = '';
                secondSetReps.value = '';
                thirdSetReps.value = '';
                fourthSetReps.value = '';
                fieldRepsError.style.display = ''
                selectMuscleGroup.value = "";
                exerciseSelect.value = "";
            })
            .catch(error => {
                console.error("Erro ao salvar treino:", error);
            });
            window.location.reload()
        } else {
            console.warn("Todos os campos devem ser preenchidos!");
            fieldRepsError.innerText = 'Campos(s) Obrigatório(s)'
            fieldRepsError.style.display = 'block'
        }

    });

});

