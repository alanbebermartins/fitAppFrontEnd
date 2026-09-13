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

    

    searchBtn.addEventListener('click', function(event) {
        event.preventDefault();
        console.log('Botão Buscar clicado');

        const selectedOption = exerciseSelect.options[exerciseSelect.selectedIndex];

        const selectedExerciseId = selectedOption.value;
        console.log('Exercício selecionado:', selectedExerciseId);

        getFilteredRealizedExercises(selectedExerciseId)
    });
    

    const ctx = document.getElementById('progressChart');

    new Chart(ctx, {
        type: 'line',
        data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
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

});

