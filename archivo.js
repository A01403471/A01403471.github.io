console.log("The master's tools will never dismantle the master's house");

let p=new Promise(function(resuelto, rechazo){
    let test=10;
    if(test==10){
        resuelto("Freedom is a constant struggle.");
    } else {
        rechazo("Being oppressed means the absence of choices");
    }

});

console.log(p);
