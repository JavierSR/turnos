document.querySelector("#crearModulo").addEventListener("click", saveModule);

function saveModule(){
    var letra= querySelector("#letra").value,
        autor= querySelector("#autor").value,
        descrip= querySelector("#descripcion").value;
        
    addModule(letra,autor,descrip); 
}