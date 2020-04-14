function addModule(){
    console.log({
        moduleLetter:   document.getElementById("letra").value,
        description:    document.getElementById("descripcion").value,
        author:         document.getElementById("autor").value
    })
    $.ajax({
        url: 'http://localhost:3000/api/module',    
        method: 'post', 
        data: JSON.stringify({
            moduleLetter:   document.getElementById("letra").value,
            description:    document.getElementById("descripcion").value,
            author:         document.getElementById("autor").value
        }),                
        dataType: 'json',
        contentType: 'application/json'
    }).done((response) => {
        console.log(response)
        if(response.state) {
            Swal.fire({
                text: 'Modulo creado',
                icon: 'success'
            })
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
    })
}