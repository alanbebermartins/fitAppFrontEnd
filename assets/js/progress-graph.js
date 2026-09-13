document.addEventListener('DOMContentLoaded', function() {

    // --------- BUSCAR CATEGORIAS DE GRUPOS MUSCULARES --------------

    const exerciseSelect = document.getElementById('exerciseSelect');
    const selectMuscleGroup = document.getElementById('selectMuscleGroup');
    const searchBtn = document.getElementById('searchBtn');
    const clearBtn = document.getElementById('clearBtn');
    const ctx = document.getElementById('progressChart');

    let progressChart = null;

    function renderEmptyChart() {
        if (progressChart) {
            progressChart.destroy();
        }

        progressChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Evolução da carga de treino',
                    data: [],
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

    renderEmptyChart();
    
    function getCategories() {
        return fetch(`${API_BASE_URL}/api/get_list_all_muscle_groups/`, {
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
        
        return fetch(`${API_BASE_URL}/api/get_list_all_exercises/`, {
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
        return fetch(`${API_BASE_URL}/api/get_list_all_realized_exercises/${uuid}/`, {
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
        const exercisesArray = data.data;

        const listWeight = [];
        const listDate = [];

        for (let i = 0; i < exercisesArray.length; i++) {
            const exercise = exercisesArray[i];
            listWeight.push(exercise.weight_kg);
            listDate.push(exercise.training_date);
        }

        if (!progressChart) {
            renderEmptyChart();
        }

        progressChart.data.labels = listDate;
        progressChart.data.datasets[0].data = listWeight;
        progressChart.update();
    }

    searchBtn.addEventListener('click', async function(event) {
        event.preventDefault();
        console.log('Botão Buscar clicado');

        const selectedOption = exerciseSelect.options[exerciseSelect.selectedIndex];

        const selectedExerciseId = selectedOption.value;

        const returnedData = await getFilteredRealizedExercises(selectedExerciseId);

        generateChart(returnedData)
    });

    clearBtn.addEventListener('click', function(event) {
        event.preventDefault();
        console.log('Botão Limpar consulta clicado');

        if (selectMuscleGroup) {
            selectMuscleGroup.selectedIndex = -1;
            selectMuscleGroup.value = '';
        }

        if (exerciseSelect) {
            exerciseSelect.innerHTML = '';
            exerciseSelect.selectedIndex = -1;
            exerciseSelect.value = '';
        }

        renderEmptyChart();
    });

});

