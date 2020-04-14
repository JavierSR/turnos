
var modules=[];

function addModule(){
    var newModule = {
    moduleLetter: document.getElementById("letra").value,
    author: document.getElementById("autor").value,
    description: document.getElementById("descripcion").value
};
modules.push(newModule);
console.log(modules);

}