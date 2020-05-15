Vue.component('back-button', {
    props: ['home'],
    methods: {
        back: function() {
            if(this.home) {
                this.$parent.changeScreen('home')
            }
            else {
                this.$parent.back()
            }
        }
    },
    template: '<button type="button" v-on:click="back" class="w-25 btn btn-info"><i class="fas fa-chevron-left"></i> Volver</button>'
})

Vue.component('menu-button',{
    props   : ['screen', 'text', 'icon'],
    methods : {
        changeScreen: function (screen) {
            if(screen === 'edit') {
                this.$parent.loadModuleList()
            }
            this.$parent.changeScreen(screen)
        }
    },
    template:  `<button v-on:click="changeScreen(screen)" class="h-50 btn-lg btn-block btn-primary">
                    <div>{{text}}</div>
                    <i v-bind:class="'fas fa-' + icon"></i> 
                </button>`
})

const app = new Vue({
    el: '.app',
    data: {
        containerClasses: 'row m-0 vh-100 text-center align-items-center justify-content-center',
        screens : {
            active  : 'home',
            previus : null
        },
        letter      : '',
        description : '',
        author      : '',
        menus: [
            {text: 'Estadísticas', icon: 'chart-bar', screen: 'stats'},
            {text: 'Creador de módulos', icon: 'plus-square', screen: 'creator'},
            {text: 'Editar módulo', icon: 'edit', screen: 'edit'},
            {text: 'Historial de turnos solicitados', icon: 'list-alt', screen: 'history'},
        ],
        modules: [],
        selectedModule: null
    },
    methods: {
        changeScreen: function(screen) {
            this.screens.previus = this.screens.active
            this.screens.active  = screen
        },
        back: function() {
            this.changeScreen(this.screens.previus)
        },
        saveModule: function(mode = {}) {
            if(!this.description.length || !this.author.length) {
                Swal.fire({
                    text : 'Debe diligenciar todos los campos',
                    icon  : 'warning'
                })
                return
            }
            $.ajax({
                url: 'http://localhost:3000/api/module',    
                method: mode.edit ? 'patch' : 'post', 
                data: JSON.stringify({
                    moduleLetter:   this.letter,
                    description:    this.description,
                    author:         this.author
                }),                
                dataType: 'json',
                contentType: 'application/json'
            }).done((response) => {
                if(response.state) {
                    Swal.fire({
                        text: 'Modulo ' + (mode.edit ? 'actualizado' : 'creado'),
                        icon: 'success'
                    })
                    if(!mode.edit) {
                        this.resetModule()
                    }
                }
                else {
                    Swal.fire({
                        title: 'Error',
                        text: response.text,
                        icon: 'error'
                    })
                }
            }).fail((response) => {
                console.error(response)
                Swal.fire({
                    text : `No se pudo ${mode.edit ? 'actualizar' : 'crear'} el módulo`,
                    icon : 'warning'
                })
            })
        },
        resetModule: function() {
            this.author      = ''
            this.description = ''
            this.letter      = this.getNextLetter()
        },
        chooseModule: function(index) {
            const selectedModule = this.modules[index]
            this.author          = selectedModule.author
            this.description     = selectedModule.description
            this.letter          = selectedModule.moduleLetter
            this.changeScreen('editInputs')
        },
        getNextLetter: function() {
            $.ajax({
                url: 'http://localhost:3000/api/letter',    
                method: 'get',               
                dataType: 'json',
                contentType: 'application/json'
            }).done((response) => {
                console.log(response)
                if (response.state && response.text) {
                    this.letter = response.text
                }
                else {
                    Swal.fire({
                        title : 'No se obutvo la letra identificadora',
                        icon  : 'warning'
                    }) 
                }
            }).fail((response) => {
                console.error(response)
                Swal.fire({
                    title : 'No se obutvo la letra identificadora',
                    icon  : 'warning'
                }) 
            })
        },
        loadModuleList: function() {
            $.ajax({
                url: 'http://localhost:3000/api/module',    
                method: 'get',               
                dataType: 'json',
                contentType: 'application/json'
            }).done((response) => {
                if (response.state && response.text.length) {
                    this.modules = response.text
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
        getTurnHistorial: function() {
            $.ajax({
                url: 'http://localhost:3000/api/turnsHistory',    
                method: 'get',               
                dataType: 'json',
                contentType: 'application/json'
            }).done((response) => {
                console.log(response)
                if (response.state && response.text.length) {
                    this.turns = response.text
                }
            }).fail((response) => {
                console.error(response)
                Swal.fire({
                    text: 'No se obtuvo respuesta del servidor',
                    icon:  'error'
                })
            })
        }
    },
    mounted: function() {
        this.letter = this.getNextLetter()
        this.turns  = this.getTurnHistorial()
    }
})