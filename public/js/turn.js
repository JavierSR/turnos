Vue.component('button-module', {
    props    : ['description', 'moduleId'],
    methods  : {
        displayTurnScreen: function() {
            this.$parent.selectedModule = this._props
            this.$parent.changeScreen('printTurn')
        }
    },
    template : `<div class="col-6 mb-3">
                    <button  v-on:click="displayTurnScreen" class="btn-lg btn-block btn-primary">
                        {{description}}
                    </button>
                </div>`
})

Vue.component('number-button',{
    props   : ['number'],
    methods : {
        writeInputValue: function() {
            if(this.$parent.identification.length < 10) {
                this.$parent.identification += this.number
            }
        },
        
    },
    template:  `<div class="col-4 my-2">
                    <button v-on:click="writeInputValue"  class="col-8 btn-lg btn-primary">{{number}}</button>
                </div>`
})

Vue.component('button-get-turn', {
    props    : ['displayText', 'turnType'],
    methods  : {
        requestTurn: function () {
            const sendData = {
                user     : this.$parent.identification,
                turnType : this.turnType,
                module   : this.$parent.selectedModule.moduleId
            }
            console.log('sendData', sendData)
            $.ajax({
                url: 'http://localhost:3000/api/turn',    
                method: 'post', 
                data: JSON.stringify(sendData),                
                dataType: 'json',
                contentType: 'application/json'
            }).done((response) => {
                if (!response.state) {
                    Swal.fire({
                        title: 'No se pudo solicitar el turno',
                        text: response.text,
                        icon:  'error'
                    })
                    return
                }

                if (sendData.turnType === 'qr') {
                    Swal.fire({
                        title : 'Escanee con la aplicación',
                        html  : '<div class="qr-container"></div>'
                    })
                    new QRCode($('.qr-container')[0], JSON.stringify({
                        key  : '8cde8ee72f76029e58b2b89c8789842d',
                        turn : response.text,
                        cc   : this.$parent.identification
                        })
                    )
                }
                else if (sendData.turnType === 'print') {
                    const pdf = new jsPDF()
                    pdf.setFontSize(24)
                    pdf.text(20, 20, 'Turno: ' + response.text)
                    pdf.setFontSize(10)
                    pdf.text(20, 40, 'Fecha y hora de impresión: ' + new Date ())
                    pdf.save(response.text + '.pdf')
                }

                this.$parent.changeScreen('home')
                this.$parent.identification = ''
            }).fail((response) => {
                console.error(response)
                this.$parent.noResponse()
            })
        }
    },
    template : `<div class="col-6">
                    <button  v-on:click="requestTurn" class="btn-lg btn-block btn-primary">
                        {{displayText}}
                    </button>
                </div>`
})

const app = new Vue({
    el: '.app',
    data: {
        selectedModule : null,
        identification : '',
        screens        : {
            active  : 'home',
            previus : null
        },
        isValidIdentification: true,
        moduleList : []
    },
    methods: {
        changeScreen: function(screen) {
            this.screens.previus = this.screens.active
            this.screens.active  = screen
        },
        eraseNumber: function() {
            this.identification = this.identification.substring(0, this.identification.length -1)
        },
        validateIdentification: function() {
            if(!this.moduleList.length) { //Si no hay modulos no deja avanzar
                return
            }
            if(this.identification.length > 4 && parseInt(this.identification)) {
                this.changeScreen('moduleSelector')
            }
            else {
                this.isValidIdentification = false
                this.identification        = ''
            }
        },
        selectModule: function(module) {
            this.selectedModule = module
            this.changeScreen('moduleBody')
        },
        noResponse: () => {
            Swal.fire({
                text: 'No se obtuvo respuesta del servidor',
                icon:  'error'
            })
        }
    },
    mounted: function() {
        $.ajax({
            url: 'http://localhost:3000/api/module',    
            method: 'get',               
            dataType: 'json',
            contentType: 'application/json'
        }).done((response) => {
            if (response.state && response.text.length) {
                this.moduleList = response.text
            }
            else {
                Swal.fire({
                    title : 'No se obtuvieron modulos',
                    text  : 'Para solicitar un turno primero cree al menos un módulo',
                    icon  : 'warnning'
                }) 
            }
        }).fail((response) => {
            console.error(response)
            this.noResponse()
        })
    }
})
