document.addEventListener('DOMContentLoaded', function() {

    // --------- BUSCAR CATEGORIAS DE GRUPOS MUSCULARES --------------

    const exerciseSelect = document.getElementById('exerciseSelect');
    const searchBtn = document.getElementById('searchBtn');
    
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

    function getFilteredRealizedExercises(uuid){
        return fetch(`http://127.0.0.1:8000/api/get_list_all_realized_exercises/${uuid}/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        })
        .then(function(response) {
            return response.json().then(function(data) {
                console.log("retorno data", data);
                return { status: response.status, data: data };
            });
        })
        .catch(function(error) {
            console.error("ERRO FETCH:", error);
        });
        
    }

    function generateChart(data) {
        // console.log("Gerando gráfico com os dados:", data);

        const exercisesArray = data.data

        console.log("exercisesArray", exercisesArray);

        let listWeight = [];
        let listDate = [];

        for (let i = 0; i < exercisesArray.length; i++) {
            const exercise = exercisesArray[i];
            // console.log("exercise", exercise);
            listWeight.push(exercise.weight_kg);
            listDate.push(exercise.training_date);
        }

        console.log("listWeight", listWeight);
        console.log("listDate", listDate);


        const ctx = document.getElementById('teste');

        new Chart(ctx, {
            type: 'line',
            data: {
            labels: listDate,
            datasets: [{
                label: 'Evolução da carga de treino',
                data: listWeight,
                borderWidth: 1
            }]
            },
            options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
            }
        });
    }

    searchBtn.addEventListener('click', async function(event) {
        event.preventDefault();
        console.log('Botão Buscar clicado');

        const selectedOption = exerciseSelect.options[exerciseSelect.selectedIndex];

        const selectedExerciseId = selectedOption.value;

        const returnedData = await getFilteredRealizedExercises(selectedExerciseId);

        generateChart(returnedData)
    });

});

