// expresion regular 1 para evaluar la primer parte del string
// evalua exprecion "A1" simple
let expresion1 = /^\=( *?\d+| *?[-]\d+| *?[-]?[a-zA-Z]+\d+)$/g;
// /^\=( *?\d+| *?[+] *?\d+| *?[-]\d+| *?[-+]?[a-zA-Z]+\d+| *?[*/+]? *?[a-zA-Z]\d+)$/g;

// evalua exprecion "A1 + A1" compuesta
let expresion2 =
  /^\=( *?\d+| *?[-]\d+| *?[-]?[a-zA-Z]+\d+)( *?[-/*+] *?)(\d+|[-]\d+|[a-zA-Z]+\d+|[-][a-zA-Z]+\d+)$/g;
// /^\=( *?\d+| *?[+] *?\d+| *?[-]\d+| *?[-+]?[a-zA-Z]+\d+| *?[*/+]? *?[a-zA-Z]\d+)( *?[-/*+] *?)(\d+|[-]\d+|[a-zA-Z]+\d+|[-][a-zA-Z]+\d+)$/g;

let expresion3 = /^(\-)?(\d+[+*/][-]?\d+|\d+[-]\d+)$/;

let caso1 = "= 1 +- A";

// console.log("caso 1" ,expresion.test(caso1))

// array1 normal deberia devolver lo mismo
let array1 = [[""]];
console.log(array1);
//A1     B1

// array2 anormal deberia tirar error
// let array2 = [
//   [1, "=A1+1", None],
//   ["=B1", "3", "=C1 + B2"],
//   // ["=3 + A1", "= 1 + A1"],
// ];
// console.log(None);

let array3 = [
  [1, 3],
  [3, "= A4 +2"],
];

// esta funcion puede recibir una matriz asi [[1,2],
//   [3,4]]

// esta funcion puede recibir una matriz asi [[1,A1],
//   [B1+1,4]]

// debo recorrer la matriz y validar que los datos no sean erroneos
// hacer una funcion para recorrer y validar que todos los datos son correctos

function evaluate(m) {
  let response = validate(m);
  if (response === true) {
    let response1 = stringOurNumber(m);
    if (response1.strings === 0) {
      return m;
    } else {
      let response2 = validateString(m);
      console.log(response2);
      if (response2.fallos === 0) {
        return m;
      } else {
        let response3 = ecuacionValid(m, expresion1, expresion2);
        if (response3.fallos === 0) {
          let response4 = resolverOperacion(m, response3);
          if (response4.mensaje !== "") {
            console.log("el mensaje esta lleno", response4.mensaje);
            console.log(response4);
            return console.error(response4.mensaje);
          } else {
            console.log(response4);
            return response4.response;
          }
        } else {
          return response3;
        }
      }
    }
  }
}

function validate(matriz) {
  console.log("validate", matriz);
  let validar = false;

  for (x = 0; x < matriz.length; x++) {
    for (y = 0; y < matriz[x].length; y++) {
      if (
        typeof matriz[x][y] === "number" ||
        typeof matriz[x][y] === "string"
      ) {
        if (matriz[x][y] === "") {
          return console.error(
            "ValueError: alguno de lo valores de entrada no es apto"
          );
        } else {
          validar = true;
        }
      } else {
        console.log(matriz[x]);
        return console.error(
          "ValueError: alguno de lo valores de entrada no es apto"
        );
      }
    }
  }
  console.log("paso 1", matriz);

  return validar;
}

function stringOurNumber(matriz) {
  let objet = {
    strings: 0,
    matriz: "",
  };
  for (x = 0; x < matriz.length; x++) {
    for (y = 0; y < matriz[x].length; y++) {
      if (typeof matriz[x][y] === "string") {
        objet.strings++;
      } else {
        objet = {
          matriz: "number",
        };
      }
    }
  }
  console.log("paso 2", matriz);
  return objet;
}

function validateString(matriz) {
  console.log("paso 3a", matriz);
  let objet = {
    fallos: 0,
    matriz: matriz,
  };
  for (i = 0; i < matriz.length; i++) {
    for (j = 0; j < matriz[i].length; j++) {
      if (typeof matriz[i][j] === "string") {
        let number = Number(matriz[i][j]);
        if (!isNaN(number)) {
          matriz[i][j] = Number(matriz[i][j]);
          console.log(matriz[i][j]);
        } else {
          objet.fallos++;

          continue;
        }
      } else {
        continue;
      }
    }
  }
  console.log("paso 3", matriz);

  return objet;
}

function ecuacionValid(matriz, expresion1, expresion2) {
  console.log(matriz);
  let objet = {
    fallos: 0,
    positionsEvil: [],
    positionGood: [],
    mensaje: "",
    errors: [],
    resolver: [],
  };
  for (x = 0; x < matriz.length; x++) {
    for (y = 0; y < matriz[x].length; y++) {
      if (typeof matriz[x][y] === "string") {
        if (matriz[x][y].match(expresion1) || matriz[x][y].match(expresion2)) {
          objet.resolver.push(matriz[x][y]);
          objet.positionGood.push([x, y]);
        } else {
          objet.fallos++;
          objet.positionsEvil.push([x, y]);
          objet.errors.push(matriz[x][y]);
          objet.mensaje =
            "ValueError: Errores en las ecuaciones revisar positions";
        }
      }
    }
  }
  return objet;
}

// A B
// let matrisTest = [
//                 /*1*/   [1,2],
//                 /*2*/   [3,4]
//                  ]

function resolverOperacion(matriz, operaciones) {
  console.log(matriz);
  console.log(operaciones);
  let position = [];

  let data = {
    response: matriz,
    mensaje: "",
  };

  for (x = 0; x < matriz.length; x++) {
    for (y = 0; y < matriz[x].length; y++) {
      if (typeof matriz[x][y] === "string") {
        let caso1 = matriz[x][y].replace(/\s+/g, "").replace("=", "");
        let caso2 = Number(caso1);
        if (!isNaN(caso2)) {
          matriz[x][y] = caso2;
        } else {
          //llamar a una funcion que me retorne el operador
          // let operadorMatematico = buscarOperadores(matriz[x][y]);
          let response = buscarOperadores(matriz[x][y]);

          let operadorMatematico = response.operador;

          console.log("posicion Columna", x);
          console.log("posicion Fila", y);
          let concat = `${x}${y}`;

          position[0] = concat;

          // llamar a una funcion que resuelva la string

          let resultString = resolverString(
            matriz[x][y],
            operadorMatematico,
            matriz,
            position
          );
          console.log(matriz[x][y]);
          console.log(resultString);
          if (resultString.mensaje !== "") {
            console.log("el mensaje", resultString);
            data.mensaje = resultString.mensaje;
          } else {
            matriz[x][y] = resultString.result;
          }
        }
      }
    }
  }

  return data;
}

function resolverString(string, operador, matriz, position) {
  console.log(string);
  console.log(operador);
  console.log("posicion de donde vengo", position);
  let data = {
    mensaje: "",
  };

  let stringOperado = string.replace(/\s+/g, "").replace("=", "");
  let stringEn2s = [];
  if (
    operador === "+" ||
    operador === "/" ||
    operador === "-" ||
    operador === "*"
  ) {
    stringEn2s = stringOperado.split(operador).filter((item) => item !== "");

    console.log(stringEn2s);
  } else {
    stringEn2s.push(stringOperado);
    console.log(stringEn2s);
  }

  console.log("string Operado", stringOperado);
  console.log("string En 2", stringEn2s);

  for (let i = 0; i < stringEn2s.length; i++) {
    let stringNumber = Number(stringEn2s[i]);
    if (!isNaN(stringNumber)) {
      console.log("Es numero", stringEn2s[i]);
      stringEn2s[i] = stringNumber;
    } else {
      // esto deberia ser otra funcion
      console.log("No es numero", stringEn2s[i]);
      let indentificadoColumna = "";
      let indentificadoFila = "";

      if (stringEn2s[i][0] === "-") {
        indentificadoColumna = stringEn2s[i][1];
        indentificadoFila = stringEn2s[i].slice(2);
      } else {
        indentificadoColumna = stringEn2s[i][0];
        indentificadoFila = stringEn2s[i].slice(1);
      }

      console.log("indentificadoColumna", indentificadoColumna);
      console.log("indentificadoFila", indentificadoFila);

      let indentificadoColumnaInt =
        indentificadoColumna.toUpperCase().charCodeAt() - 65;
      let indeindentificadoFilaInt = parseInt(indentificadoFila) - 1;

      console.log("indentificadoColumnaInt", indentificadoColumnaInt);
      console.log("indeindentificadoFilaInt", indeindentificadoFilaInt);

      console.log("largo de la matriz", matriz.length);

      if (indeindentificadoFilaInt > matriz.length) {
        data.mensaje =
          "ReferenceError: la celda a la cual esta intentando acceder, no esta definida.";
        return data;
      }

      console.log(position);

      for (let u = 0; u < position.length; u++) {
        console.log(position[u][1]);
        console.log(position[u][0]);

        console.log("identificador de columna", indentificadoColumnaInt);
        console.log("identificador de Fila", indeindentificadoFilaInt);
        if (
          indentificadoColumnaInt == position[u][1] &&
          indeindentificadoFilaInt == position[u][0]
        ) {
          console.log("hay una referencia circular");
          data.mensaje = "ValueError: si hay una referencia circular";
          console.log(data);
          return data;
        } else {
          continue;
        }
      }

      // console.log("largo de las sub matrizes", matriz[i].length);
      console.log(indentificadoColumnaInt);
      console.log(indeindentificadoFilaInt);
      console.log(matriz[indeindentificadoFilaInt][indentificadoColumnaInt]);
      console.log(matriz);

      let response = matriz[indeindentificadoFilaInt][indentificadoColumnaInt];
      console.log("response", response);
      console.log("si la respuesta es un numero");
      console.log(matriz[x][y] + "************************");

      if (response === undefined) {
        data.mensaje =
          "ReferenceError: la celda a la cual esta intentando acceder, no esta definida.";
        return data;
      } else {
        if (isNaN(response)) {
          console.log("es NaN" + response);
          console.log(
            "numero o string de matriz"
            // matriz[indeindentificadoFilaInt][indentificadoColumnaInt]
          );
          let oper = buscarOperadores(
            matriz[indeindentificadoFilaInt][indentificadoColumnaInt]
          );
          console.log(oper);

          let result2 = resolverString(
            matriz[indeindentificadoFilaInt][indentificadoColumnaInt],
            oper.operador,
            matriz,
            position
          );
          console.log(result2);
          if (result2.mensaje === "") {
            stringEn2s[i] = result2.result;
          } else {
            return result2;
          }
        } else {
          if (stringEn2s[i][0] === "-") {
            stringEn2s[i] = response - response * 2;
          } else {
            stringEn2s[i] = response;
          }
        }
      }
    }
  }
  console.log("stringEn2s despues de resolver striing=>", stringEn2s);

  console.log(typeof stringEn2s[0]);
  if (typeof stringEn2s[0] !== "number" && stringEn2s.length == 1) {
    return stringEn2s[0];
  } else {
    console.log("entro");
    let responseOperacion = resol(stringEn2s, operador);
    if (responseOperacion.mensaje === "") return responseOperacion;
    return responseOperacion;
  }
}

function buscarOperadores(stringBase) {
  let data = {
    operador: "",
    position: 0,
  };
  let positionOperadores = [];
  console.log("aca esta el string base", stringBase);
  console.log("tenemos que recorrer el string");

  let stringArray = stringBase.split("");
  console.log("string en array", stringArray);

  for (let i = 0; i < stringArray.length; i++) {
    if (
      stringArray[i] === "-" ||
      stringArray[i] === "/" ||
      stringArray[i] === "*" ||
      stringArray[i] === "+"
    ) {
      console.log("encontrado", stringArray[i]);
      console.log("position", i);

      positionOperadores.push(i);
      console.log(
        "En estas posiciones encontro los operadores",
        positionOperadores
      );
    }

    console.log(stringArray[i]);
  }
  console.log(stringBase.length);
  console.log(positionOperadores.length);
  if (positionOperadores.length === 1) {
    data.operador = stringBase[positionOperadores[0]];
    data.position = positionOperadores[0];
  } else {
    console.log(positionOperadores[0]);
    if (positionOperadores[0] > 1) {
      data.operador = stringBase[positionOperadores[0]];
      data.position = positionOperadores[0];
    } else {
      data.operador = stringBase[positionOperadores[1]];
      data.position = positionOperadores[1];
    }
    console.log(positionOperadores);
  }

  console.log(data);
  return data;
}

function resol(stringEnDos, operadorMatematico) {
  console.log(stringEnDos);
  console.log(operadorMatematico);
  let objet = {
    result: 0,
    mensaje: "",
  };
  console.log(stringEnDos[0]);
  if (stringEnDos.length === 1) {
    if (operadorMatematico === "-") {
      objet.result = stringEnDos[0] - stringEnDos[0] * 2;
    } else {
      objet.result = stringEnDos[0];
    }

    return objet;
  }
  if (operadorMatematico === 1) {
    console.log("entraa");
    console.log(stringEnDos[0]);
    objet.result = stringEnDos[0];
  } else {
    let parteAInt = Number(stringEnDos[0]);
    let parteBInt = Number(stringEnDos[1]);

    switch (operadorMatematico) {
      case "/":
        if (parteAInt === 0 || parteBInt === 0) {
          objet.mensaje = "ZeroDivisionError: la divicion esta hecha por 0";
          // return console.error(
          //   "ZeroDivisionError: la divicion esta hecha por 0"
          // );
        }
        objet.result = parteAInt / parteBInt;
        break;
      case "+":
        objet.result = parteAInt + parteBInt;
        break;
      case "-":
        objet.result = parteAInt - parteBInt;
        break;
      case "*":
        objet.result = parteAInt * parteBInt;
        break;
      default:
        break;
    }
  }
  console.log("objet", objet);
  return objet;
}

console.log("respuesta final", evaluate(array1));

// console.log(buscarOperadoreAndPosition("=-1 - -1"));
