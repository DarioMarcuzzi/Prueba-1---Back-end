// expresion regular 1 para evaluar la primer parte del string
// evalua exprecion "A1" simple
let expresion1 = /^\=( *?\d+| *?[-]\d+| *?[-]?[a-zA-Z]+\d+)$/g;

// evalua exprecion "A1 + A1" compuesta
let expresion2 =
  /^\=( *?\d+| *?[-]\d+| *?[-]?[a-zA-Z]+\d+)( *?[-/*+] *?)(\d+|[-]\d+|[a-zA-Z]+\d+|[-][a-zA-Z]+\d+)$/g;

// let expresion3 = /^(\-)?(\d+[+*/][-]?\d+|\d+[-]\d+)$/;

let array1 = [
  [1, "=-A1"],
  [3, "=A2+1"],
];
console.log(array1);

function evaluate(m) {
  let response = validate(m);
  if (response === true) {
    let response1 = stringOurNumber(m);
    if (response1.strings === 0) {
      return m;
    } else {
      let response2 = validateString(m);

      if (response2.fallos === 0) {
        return m;
      } else {
        let response3 = ecuacionValid(m, expresion1, expresion2);
        if (response3.fallos === 0) {
          let response4 = resolverOperacion(m, response3);
          if (response4.mensaje !== "") {
            return console.error(response4.mensaje);
          } else {
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
        return console.error(
          "ValueError: alguno de lo valores de entrada no es apto"
        );
      }
    }
  }

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

  return objet;
}

function validateString(matriz) {
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
        } else {
          objet.fallos++;

          continue;
        }
      } else {
        continue;
      }
    }
  }

  return objet;
}

function ecuacionValid(matriz, expresion1, expresion2) {
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

function resolverOperacion(matriz) {
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
          let response = buscarOperadores(matriz[x][y]);

          let operadorMatematico = response.operador;

          let concat = `${x}${y}`;

          position[0] = concat;

          // llamar a una funcion que resuelva la string

          let resultString = resolverString(
            matriz[x][y],
            operadorMatematico,
            matriz,
            position
          );

          if (resultString.mensaje !== "") {
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
  } else {
    stringEn2s.push(stringOperado);
  }

  for (let i = 0; i < stringEn2s.length; i++) {
    let stringNumber = Number(stringEn2s[i]);
    if (!isNaN(stringNumber)) {
      stringEn2s[i] = stringNumber;
    } else {
      let indentificadoColumna = "";
      let indentificadoFila = "";

      if (stringEn2s[i][0] === "-") {
        indentificadoColumna = stringEn2s[i][1];
        indentificadoFila = stringEn2s[i].slice(2);
      } else {
        indentificadoColumna = stringEn2s[i][0];
        indentificadoFila = stringEn2s[i].slice(1);
      }

      let indentificadoColumnaInt =
        indentificadoColumna.toUpperCase().charCodeAt() - 65;
      let indeindentificadoFilaInt = parseInt(indentificadoFila) - 1;

      if (indeindentificadoFilaInt > matriz.length) {
        data.mensaje =
          "ReferenceError: la celda a la cual esta intentando acceder, no esta definida.";
        return data;
      }

      for (let u = 0; u < position.length; u++) {
        if (
          indentificadoColumnaInt == position[u][1] &&
          indeindentificadoFilaInt == position[u][0]
        ) {
          data.mensaje = "ValueError: si hay una referencia circular";

          return data;
        } else {
          continue;
        }
      }

      let response = matriz[indeindentificadoFilaInt][indentificadoColumnaInt];

      if (response === undefined) {
        data.mensaje =
          "ReferenceError: la celda a la cual esta intentando acceder, no esta definida.";
        return data;
      } else {
        if (isNaN(response)) {
          let oper = buscarOperadores(
            matriz[indeindentificadoFilaInt][indentificadoColumnaInt]
          );

          let result2 = resolverString(
            matriz[indeindentificadoFilaInt][indentificadoColumnaInt],
            oper.operador,
            matriz,
            position
          );

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

  if (typeof stringEn2s[0] !== "number" && stringEn2s.length == 1) {
    return stringEn2s[0];
  } else {
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

  let stringArray = stringBase.split("");

  for (let i = 0; i < stringArray.length; i++) {
    if (
      stringArray[i] === "-" ||
      stringArray[i] === "/" ||
      stringArray[i] === "*" ||
      stringArray[i] === "+"
    ) {
      positionOperadores.push(i);
    }
  }

  if (positionOperadores.length === 1) {
    data.operador = stringBase[positionOperadores[0]];
    data.position = positionOperadores[0];
  } else {
    if (positionOperadores[0] > 1) {
      data.operador = stringBase[positionOperadores[0]];
      data.position = positionOperadores[0];
    } else {
      data.operador = stringBase[positionOperadores[1]];
      data.position = positionOperadores[1];
    }
  }

  return data;
}

function resol(stringEnDos, operadorMatematico) {
  let objet = {
    result: 0,
    mensaje: "",
  };

  if (stringEnDos.length === 1) {
    if (operadorMatematico === "-") {
      objet.result = stringEnDos[0] - stringEnDos[0] * 2;
    } else {
      objet.result = stringEnDos[0];
    }

    return objet;
  }
  if (operadorMatematico === 1) {
    objet.result = stringEnDos[0];
  } else {
    let parteAInt = Number(stringEnDos[0]);
    let parteBInt = Number(stringEnDos[1]);

    switch (operadorMatematico) {
      case "/":
        if (parteAInt === 0 || parteBInt === 0) {
          objet.mensaje = "ZeroDivisionError: la division esta hecha por 0";
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

  return objet;
}

console.log("respuesta final", evaluate(array1));
