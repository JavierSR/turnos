Vue.component('main-button',{
    props   : ['link', 'text', 'icon'],
    template:  `<a v-bind:href="link" class='col-12'>
                    <button class="btn-lg btn-block btn-primary">
                    <div>{{text}}</div> 
                    <i v-bind:class="'fas fa-' + icon"></i>
                    </button>
                </a>`
})

const app = new Vue({
    el: '.app',
    data: {
        buttons: [
            {link: 'admin.html', text: 'Portal administrativo', icon: 'user-tie'},
            {link: 'attend.html', text: 'Portal de atención', icon: 'concierge-bell'},
            {link: 'turn.html', text: 'Solicitar turnos', icon: 'ticket-alt'},
            {link: 'screen.html', text: 'Pantalla de turnos', icon: 'desktop'},
        ]
    }
})