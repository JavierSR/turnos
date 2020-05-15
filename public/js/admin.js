const app = new Vue({
    el: '.app',
    data: {
        letter      : '',
        description : '',
        author      : ''
    },
    methods: {
        addModule: function() {
            console.log({
                moduleLetter:   this.letter,
                description:    this.description,
                author:         this.author
            })
            if(!this.description.length || !this.author.length) {
                Swal.fire({
                    text : 'Debe diligenciar todos los campos',
                    icon  : 'warning'
                })
                return
            }
            $.ajax({
                url: 'http://localhost:3000/api/module',    
                method: 'post', 
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
                        text: 'Modulo creado',
                        icon: 'success'
                    })
                    this.resetModule()
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
                    title : 'No se pudo crear el modulo',
                    icon  : 'warning'
                })
            })
        },
        resetModule: function() {
            this.author      = ''
            this.description = ''
            this.letter      = this.getNextLetter()
        },
        getNextLetter : function() {
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
        }
    },
    mounted: function() {
        this.letter = this.getNextLetter()
    }
})