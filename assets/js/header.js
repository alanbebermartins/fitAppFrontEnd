document.addEventListener('DOMContentLoaded', function() {
    const dashboardButton = document.getElementById('dashboardButton')
    const graphButton = document.getElementById('graphButton')

    dashboardButton.addEventListener('click', () => {
        console.log('botao dashboard clicado')
        window.location.replace('/home') 
    })
    
    graphButton.addEventListener('click', () => {
        console.log('botao do grafico clicado')
        window.location.replace('/grafico-de-progresso') 
    })

})