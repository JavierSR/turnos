Vue.component('button-container', {
    props    : ['displayText', 'moduleId'],
    methods  : {
        displayTurnScreen: function() {
            this.$parent.selectedModule = this.moduleId
            this.$parent.changeScreen('printTurn')
        }
    },
    template : `<div class="col-6">
                    <button  v-on:click="displayTurnScreen" class="btn-lg btn-block btn-primary">
                        {{displayText}} {{moduleId}}
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
                module   : this.$parent.selectedModule
            }
            console.log('sendData', sendData)
            $.ajax({
                url: 'http://localhost:3000/api/turn',    
                method: 'post', 
                data: JSON.stringify(sendData),                
                dataType: 'json',
                contentType: 'application/json'
            }).done((response) => {
                console.log(response)
                if (!response.state) {
                    Swal.fire({
                        text: 'Ocurrió un error en el servidor',
                        icon:  'error'
                    })
                    return
                }

                if (sendData.turnType === 'qr') {
                    Swal.fire({
                        title : 'Escanee con la aplicación',
                        html  : '<div class="qr-container"></div>'
                    })
                    new QRCode($('.qr-container')[0], response.text)
                }
                else if (sendData.turnType === 'print') {
                    const pdf = new jsPDF()
                    pdf.setFontSize(24)
                    pdf.text(20, 20, 'Turno: ' + response.text)
                    pdf.setFontSize(10)
                    pdf.text(20, 40, 'Fecha y hora de impresión: ' + new Date ())
                    // pdf.html(`
                    //     <p>Turno: ${response.text}</p>
                    //     <p style="font-size: 8px"> Fecha y hora de impresion: ${new Date()}</p>
                    // `)
                    console.log('this2', this)
                    pdf.save(response.text + '.pdf')
                }

                this.$parent.changeScreen('home')
                this.$parent.identification = ''
            }).fail((response) => {
                console.error(response)
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
        changeScreen: function(screen){
            this.screens.previus = this.screens.active
            this.screens.active  = screen
        },
        eraseNumber: function() {
            this.identification = this.identification.substring(0, this.identification.length -1)
        },
        validateIdentification: function() {
            if(this.identification.length > 4 && parseInt(this.identification)) {
                this.changeScreen('moduleSelector')
            }
            else {
                this.isValidIdentification = false
                this.identification        = ''
            }
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
            if (response.state) {
                this.moduleList = response.text
            }
        }).fail((response) => {
            console.error(response)
        })
    },
})
