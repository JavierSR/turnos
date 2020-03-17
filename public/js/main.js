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
                url: '127.0.0.1:3000/api/turn',    
                method: 'post', 
                data: JSON.stringify(sendData),                
                dataType: 'json',
                contentType: "application/json"           
            }).done((response) => {
                console.log(">>>", response)
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
        moduleList : [
            {
                "_id": "5e702ffa2cb5762540b7968c",
                "description": "Primer modulo creado de forma dinamica",
                "author": "Oscar",
                "moduleLetter": "A",
                "created": "2020-03-17T02:03:38.371Z",
                "__v": 0
            },
            {
                "_id": "5e7030292cb5762540b7968d",
                "description": "Modulo de atencion al cliente",
                "author": "Javier",
                "moduleLetter": "B",
                "created": "2020-03-17T02:04:25.210Z",
                "__v": 0
            },
            {
                "_id": "5e70382882bc7608b0e5e8b2",
                "description": "Modulo de PQR",
                "author": "Sandoval",
                "moduleLetter": "C",
                "created": "2020-03-17T02:38:32.995Z",
                "__v": 0
            },
            {
                "_id": "5e70383382bc7608b0e5e8b3",
                "description": "Modulo dasdasdasd",
                "author": "Royero",
                "moduleLetter": "D",
                "created": "2020-03-17T02:38:43.658Z",
                "__v": 0
            }
        ]
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
    }

})
