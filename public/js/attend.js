const app = new Vue({
    el: '.app',
    data: {
        selectedModule : null,
        screens        : {
            active  : 'home',
            previus : null
        },
        moduleList : []
    },
    methods: {
        changeScreen: function(screen){
            this.screens.previus = this.screens.active
            this.screens.active  = screen
        },
        arrive: function(){           
            document.getElementById("estado").innerHTML= "Atendiendo";
            document.getElementById("attend").disabled= true;
            document.getElementById("attend").className= "col-4 btn-lg btn-outline-primary";
        },
        selectModule: function(module) {
            this.selectedModule = module
            this.changeScreen('moduleBody')
        }
    },
    mounted: function() {
        $.ajax({
            url: 'http://localhost:3000/api/module',    
            method: 'get',               
            dataType: 'json',
            contentType: 'application/json'
        }).done((response) => {
            console.log(response)
            if (response.state && response.text.length) {
                this.moduleList = response.text
            }
            else {
                Swal.fire({
                    title : 'No se obtuvieron modulos',
                    text  : 'Un administrador debe crear los modulos de atención',
                    icon  : 'warnning'
                }) 
            }
        }).fail((response) => {
            console.error(response)
            Swal.fire({
                text: 'No se obtuvo respuesta del servidor',
                icon:  'error'
            })
        })
    },
})