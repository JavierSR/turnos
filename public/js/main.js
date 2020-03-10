Vue.component('button-container', {
    props    : ['displayText', 'moduleId'],
    methods  : {
        displayTurnScreen: function() {
            this.$parent._data.selectedModule = this._props.moduleId
            this.$parent._data.activeScreen   = 'printTurn'
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
        addNumber: function() {
            const actual = this.$parent._data.cedula
            this._props.addNumber
        }
    },
    template:  `<div v-onclick="addNumber" class="col-4 my-2">
                    <button class="col-8 btn-lg btn-primary">{{number}}</button>
                </div>`
})

Vue.component('button-get-turn', {
    props    : ['displayText', 'turnType'],
    methods  : {
        pedirTurno: function () {
            const sendData = {
                user: '1121946367',
                turnType: this.turnType,
                module: this.$parent._data.selectedModule
            }
            console.log('SendData', sendData)
            $.ajax({
                url: '127.0.0.1:3000/api/newTurn',    
                method: 'post', 
                data: JSON.stringify(sendData),                
                dataType: 'json',
                contentType: "application/json"           
            }).done((response) => {
                console.log("algoo", response)
            });
        }
    },
    template : `<div class="col-6">
                    <button  v-on:click="pedirTurno" class="btn-lg btn-block btn-primary">
                        {{displayText}}
                    </button>
                </div>`
})

const app = new Vue({
    el: '.app',
    data: {
        selectedModule : null,
        activeScreen   : 'home',
        cedula         : ''
    },
    methods: {
        displayHomeScreen: function(){
            this.activeScreen = 'home'
        },
    }
})



