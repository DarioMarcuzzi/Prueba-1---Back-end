
// expresion regular 1 para evaluar la primer parte del string
let expresion1 = /^\=( *?\d+| *?[+] *?\d+| *?[-]\d+| *?[-*/+]?[a-zA-Z]+\d+| *?[*/+]? *?[a-zA-Z]\d+)$/g

let expresion2 = /^\=( *?\d+| *?[+] *?\d+| *?[-]\d+| *?[-*/+]?[a-zA-Z]+\d+| *?[*/+]? *?[a-zA-Z]\d+)( *?[-/*+] *?)(\d+|[-]\d+|[a-zA-Z]+\d+|[-][a-zA-Z]+\d+)$/g


let caso1 = "= 1 + - 2A"

// console.log("caso 1" ,expresion.test(caso1))


// array1 normal deberia devolver lo mismo
let array1 =  [["= 2","2"],
              [3,"= - A2 +  A1"],
              [5, "= -1 -1"]]
console.log(array1)

// array2 anormal deberia tirar error
let array2 =  [["=-1","2"],
              [2,"=10 / 2"],
              ]


let array3 =  [[1,3],
              [3,"= A4 +2"]]


// esta funcion puede recibir una matriz asi [[1,2],
                                         //   [3,4]]


// esta funcion puede recibir una matriz asi [[1,A1],
                                         //   [B1+1,4]]

// debo recorrer la matriz y validar que los datos no sean erroneos
// hacer una funcion para recorrer y validar que todos los datos son correctos



function evaluate (m) {
  let response = validate(m)
  if(response === true) {
    let response1 = stringOurNumber(m)
    if(response1.strings === 0){
      return m
    }
    else {
      let response2 = validateString(m)
         console.log(response2)
          if(response2.fallos === 0){
            return m
          }else{
          let response3 = ecuacionValid(m,expresion1,expresion2)
            if(response3.fallos === 0){
              let response4 = resolverOperacion(m,response3)

            }else{
              return response3
            }
        } 
    }
      
  } 
  

}

function validate(matriz) {
  console.log("validate", matriz)
  let validar = false

  for (x=0;x<matriz.length;x++) {
      for (y=0;y<matriz[x].length;y++) {
      if(typeof matriz[x][y] === "number" || typeof matriz[x][y] === "string"){
          validar = true
      } else{
          return console.error("ValueError: alguno de lo valores de entrada no es apto") 
          
        }
        
  
      }
    }
    console.log("paso 1",matriz)
    
    
    return validar
  }

  function stringOurNumber(matriz){
    let objet = {
      strings: 0,
      matriz: ""

    }
    for(x=0;x<matriz.length;x++){
        for(y=0;y<matriz[x].length;y++){
          if(typeof matriz[x][y] === "string"){
            objet.strings++
          } else {
            objet={
              matriz: "number"
            }
          
          }
        }
        
    }
    console.log("paso 2",matriz)
    return objet
  }

  function validateString(matriz){
    console.log("paso 3a",matriz)
    let  objet = {
      fallos: 0,
      matriz: matriz
    

    }
    for (i=0;i<matriz.length;i++) {
      for (j=0;j<matriz[i].length;j++) {
         if(typeof matriz[i][j] === "string"){
            let number = Number(matriz[i][j])
            if(!isNaN(number)){ 
              
              matriz[i][j] = Number(matriz[i][j])
              console.log(matriz[i][j])
              
            } else{
              objet.fallos++
              
              continue
              }
          } else {
            continue
          }
        

      }
      
    }
    console.log("paso 3",matriz)
    
    return objet

}

  function ecuacionValid(matriz,expresion1, expresion2){
    let objet = {
      fallos: 0,
      positionsEvil: [],
      positionGood: [],
      mensaje: "",
      errors: [],
      resolver: []
    }
    for(x=0;x<matriz.length;x++){
      for(y=0;y<matriz[x].length;y++){
        if(typeof matriz[x][y] === "string"){
          if(matriz[x][y].match(expresion1)||matriz[x][y].match(expresion2) ){
            objet.resolver.push(matriz[x][y])
            objet.positionGood.push([x,y])
          } else{
            objet.fallos++
            objet.positionsEvil.push([x,y])
            objet.errors.push(matriz[x][y])
            objet.mensaje =  "ValueError: Errores en las ecuaciones revisar positions"
          }
        }
      }
    }
    return objet
  }


  // A B
  // let matrisTest = [
    //                 /*1*/   [1,2], 
    //                 /*2*/   [3,4]
    //                  ]
    
function resolverOperacion(matriz, operaciones){
  console.log(matriz)
  console.log(operaciones)
  let operaciones2 = []

  for(x=0;x<matriz.length;x++){
    for(y=0;y<matriz[x].length;y++){
      if(typeof matriz[x][y] === "string"){
        let caso1 = matriz[x][y].replace(/\s+/g, '').replace("=","")
        let caso2 = Number(caso1)
        if(!isNaN(caso2)){
          matriz[x][y] = caso2
        }
        else {
          console.log(matriz[x][y])
          let operadorMatematico = buscarOperadores(matriz[x][y])
          let ecuacion = matriz[x][y].replace(/\s+/g, '').replace("=","")
          // console.log(operadorMatematico)
           let stringEnDos =(ecuacion.split(operadorMatematico))
           console.log(stringEnDos)
           if(stringEnDos[0] === ""){
            console.log("bien")
           }else {
            
            console.log("Paso 2  desarmar de nuevo") 
            console.log(stringEnDos[0]);  
            console.log(stringEnDos[0].slice(1));  

            let indentificadoColumna = stringEnDos[0][0];
            let indentificadoFila = stringEnDos[0].slice(1);
            let operacion = operadorMatematico
            let operando = stringEnDos[1];
            console.log(indentificadoColumna)
            console.log(indentificadoFila)
            console.log(operacion)
            let indentificadoColumnaInt = indentificadoColumna.toUpperCase().charCodeAt() - 65
            let indeindentificadoFilaInt = (parseInt(indentificadoFila) - 1)

            console.log(indeindentificadoFilaInt)
            console.log(indentificadoColumnaInt)
           }

          // console.log("retiramos el igual y los espacios en la ecuacion")
          // console.log("ecuacion", ecuacion)

          
        }
      }
    }
  }
 console.log(matriz)

  // for (let i = 0; i < operaciones.resolver.length; i++) {
  //     let caso1 =operaciones.resolver[i].replace(/\s+/g, '').replace("=","")
  //     let caso2 = Number(caso1)
  //     if(!isNaN(caso2)){
  //       operaciones2.push(caso2)
  //       continue
  //     }
  //     function resolverFinal(){
  //       let saludo = "hola"
         
  //       return saludo
  //     }
  //      operaciones2.push(resolverFinal())
  //   }
  //   console.log("operaciones desp de cortarle los espacios",operaciones2)
    
    
    
    // function buscarOperadores(operaciones){
      
    //   if(operaciones[i].match(expresion1)){
    //     let oper = [" + "," - "," / "," * ","*","/","-","+",]
    //     let result= "";
    //     let i = 0;
    //     let encontrado = false;
    //     let indexSimbol= -1;
    //     while(!encontrado && i < 8){
    //       console.log(operacion)
    //       encontrado = operacion.includes(oper[i])
    //       console.log(oper[i])
    //         if(encontrado) indexSimbol = i;
    //         i++
    //       }
    //       return oper[indexSimbol]
          
    //     }else{
    //       let oper = [" + "," - "," / "," * "]
    //       let result= "";
    //       let i = 0;
    //       let encontrado = false;
    //       let indexSimbol= -1;
    //       while(!encontrado && i < 8){
            
    //         encontrado = operacion.includes(oper[i])
    //         console.log(oper[i])
    //         if(encontrado) indexSimbol = i;
    //         i++
    //       }
    //       return oper[indexSimbol].trim()
          
          
    //     }
        
        
        
    //   }
      
      //  let operacionTest = "= B42 + -2";
       function buscarOperadores(stringBase){
        console.log(stringBase)
         if(stringBase.match(expresion1)){
          console.log("entro a con la primera exprecion regular")
        let oper = [" + "," - "," / "," * ","*","/","-","+",]
        let result= "";
        let i = 0;
        let encontrado = false;
        let indexSimbol= -1;
        while(!encontrado && i < 8){
          console.log(stringBase)
          encontrado = stringBase.includes(oper[i])
          console.log(oper[i])
            if(encontrado) indexSimbol = i;
            console.log(encontrado)
            i++
          }
          console.log(oper[indexSimbol])
          return oper[indexSimbol]
          
        }else{
          let oper = [" + "," - "," / "," * "]
          let result= "";
          let i = 0;
          let encontrado = false;
          let indexSimbol= -1;
          while(!encontrado && i < 8){
            
            encontrado = stringBase.includes(oper[i])
            console.log(oper[i])
            if(encontrado) indexSimbol = i;
            i++
          }
          return oper[indexSimbol].trim()
          
          
        }
        
        
        
      }
    }

console.log(evaluate(array2))

//  function resolverOperacion(matris,stringOperacion){
 
//   console.log("string original");
//   console.log(stringOperacion)
  
//   console.log("operador matematico del string");
//   let operadoMatematico = buscarOperadores(stringOperacion);
//   console.log(operadoMatematico);
  
//   console.log("Quitar espacios y el signo igual")
//   stringOperacion = stringOperacion.replace(/\s+/g, '').replace("=","")
//   console.log(stringOperacion);

//   console.log("Paso 1 desarmar en 2")
//   let partesOperacion = stringOperacion.split(operadoMatematico)
//   console.log(partesOperacion)
  
//   console.log("Paso 2  desarmar de nuevo") 
//   console.log(partesOperacion[0]);  
//   console.log(partesOperacion[0].slice(1));  
    
//   let indentificadoColumna = partesOperacion[0][0];
//   let indentificadoFila = partesOperacion[0].slice(1);
//   let operacion = stringOperacion[2];
//   let operando = partesOperacion[1];
  
//   console.log("Paso validar datos")
//   console.log(indentificadoColumna);
//   console.log(indentificadoFila);
//   console.log(operacion);
//   console.log(operando);

//    // A =  0;
//    // B =  1;
//     console.log("Paso 2 transfomar a posiciones de matris");
//     let indentificadoColumnaInt = indentificadoColumna.toUpperCase().charCodeAt() - 65
//     let indeindentificadoFilaInt = (parseInt(indentificadoFila) - 1)
//     console.log(indentificadoColumnaInt);
//     console.log(indeindentificadoFilaInt);
    

//  }
 

//  let operacionTest = "= B42 + -2";
//  function buscarOperadores(stringBase){
//      let oper = [" + "," - "," / "," * "]
//      let result = "";
//      let i = 0;
//      let encontrado = false;
//      let indexSimbol = -1;
//      while(!encontrado && i < 4){
//          encontrado = stringBase.includes(oper[i])
//          if(encontrado) indexSimbol = i;
//          i++;
//      }
//      return oper[indexSimbol].trim();
//  }
 
 
//  //console.log(buscarOperadores(operacionTest));
 

// resolverOperacion(matrisTest, operacion)