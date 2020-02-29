Vue.component('button-container', {
    props    : ['displayText', 'moduleId'],
    methods  : {
        displayTurnScreen: function() {
            this.$parent._data.selectedModule = this._props.moduleId
            this.$parent._data.activeScreen   = 'printTurn'
        }
    },
    template : `<div class="col-6">
                    <button v-on:click="displayTurnScreen" class="btn-lg btn-block btn-primary">
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

