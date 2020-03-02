Vue.component('button-container', {
    props    : ['displayText', 'moduleId'],
    methods  : {
        displayTurnScreen: function() {
            this.$parent._data.selectedModule = this._props.moduleId
            this.$parent._data.activeScreen   = 'printTurn'
        },
        pedirTurno: function () {
            $.ajax({
                url: 'localhost:3000/api/newTurn',    
                method: 'post', 
                data: 'turno',                
                dataType: 'json',
                contentType: "application/json"           
            }).done((response) => {
                console.log("algoo"+response)
            });
        }
    },
    template : `<div class="col-6">
                    <button v-if="moduleId>0"  v-on:click="displayTurnScreen" class="btn-lg btn-block btn-primary">
                        {{displayText}} {{moduleId > 0 ? moduleId : ''}}
                    </button>

                    <button v-else v-on:click="pedirTurno" class="btn-lg btn-block btn-primary">
                        {{displayText}} {{moduleId > 0 ? moduleId : ''}}
                    </button>
                </div>`
})

const app = new Vue({
    el: '.app',
    data: {
        selectedModule : 1,
        activeScreen   : 'home'
    }
})

var turno = new Vue({
        "user": "javier",
        "turnType": "qr",
        "module": "A",
  })



