const app = new Vue({
    el: '.app',
    data: {
        selectedModule : null,
        currentTurn    : null,
        attendState    : false,
        turnQueue      : false,
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
        toggleDOMAttend: () => {
            const   attendButton = $('#attend'),
                    stateText    = $('#estado')

            if(this.attendState) {
                attendButton.prop('disabled', false)
                attendButton.removeClass('btn-outline-primary')
                stateText.text('En modulo')
                this.attendState = false
            }
            else {
                attendButton.prop('disabled', true)
                attendButton.addClass('btn-outline-primary')
                stateText.text('Atendiendo')
                this.attendState = true
            }
        },
        attendTurn: function() {
            $.ajax({
                url         : 'http://localhost:3000/api/turn',    
                method      : 'patch',               
                dataType    : 'json',
                contentType : 'application/json',
                data: JSON.stringify({
                    turnNumber: `${this.selectedModule.moduleLetter}-${this.currentTurn}`
                })
            })
            .fail((response) => {
                console.error(response)
                Swal.fire({
                    text: 'Ocurrió un error al tratar de atender el turno',
                    icon:  'error'
                })
            })
        },
        arrive: function(){           
            this.toggleDOMAttend()
            this.attendTurn()
        },
        updateCurrentTurn: function() {
            $.ajax({
                url         : 'http://localhost:3000/api/nextTurn',    
                method      : 'post',
                data        : JSON.stringify({moduleId: this.selectedModule.moduleLetter}),
                dataType    : 'json',
                contentType : 'application/json'
            }).done((response) => {
                if (response.state) {
                    this.currentTurn = response.text
                    this.turnQueue   = true
                }
                else {
                    Swal.fire({
                        text : response.text,
                        icon : 'info'
                    })
                    this.turnQueue = false
                }
            }).fail((response) => {
                console.error(response)
                Swal.fire({
                    text: 'No se obtuvo respuesta del servidor',
                    icon:  'error'
                })
            })
        },
        nextTurn: function() {
            //Si el turno nunca llegó de todas formas registra la atención
            if(!this.attendState) {
                this.attendTurn()
                this.toggleDOMAttend()
            }
            this.toggleDOMAttend()
            $.ajax({
                url         : 'http://localhost:3000/api/finishTurn',    
                method      : 'post',               
                dataType    : 'json',
                contentType : 'application/json',
                data: JSON.stringify({
                    turnNumber: `${this.selectedModule.moduleLetter}-${this.currentTurn}`
                })
            }).done((response) => {
                if (response.state) {
                    this.updateCurrentTurn()
                }
            }).fail((response) => {
                console.error(response)
                Swal.fire({
                    text: 'Ocurrió un error al tratar de atender el turno',
                    icon:  'error'
                })
            })
        },
        selectModule: function(_module) {
            this.selectedModule = _module
            this.changeScreen('moduleBody')
            this.updateCurrentTurn()
        }
    },
    mounted: function() {
        $.ajax({
            url: 'http://localhost:3000/api/module',    
            method: 'get',               
        }).done((response) => {
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