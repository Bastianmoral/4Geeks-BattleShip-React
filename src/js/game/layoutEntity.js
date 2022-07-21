// CON ESTO DELIMITAMOS EL TABLERO Y SUS DIMENSIONES.
export const BOARD_ROWS = 10;
export const BOARD_COLUMNS = 10;
export const BOARD = BOARD_COLUMNS * BOARD_ROWS;

// SE CREAN COMO OBJETOS EL ESTADO DE CADA UNO DE LOS CUADRADOS 
export const SQUARE_STATE = {
    empty: 'empty',
    ship: 'ship',
    hit: 'hit',
    miss: 'miss',
    ship_sunk: 'ship_sunk',
    forbidden: 'forbidden',
    awaiting: 'awaiting',
};

//CON ESTO PASAMOS A CLASES LOS ESTADOS ANTERIORMENTE CREADOS
export const stateToClass =  {
    [SQUARE_STATE.empty]:  'empty',
    [SQUARE_STATE.ship]:  'ship',
    [SQUARE_STATE.hit]:  'hit',
    [SQUARE_STATE.miss]:  'miss',
    [SQUARE_STATE.ship_sunk]:  'ship-sunk',
    [SQUARE_STATE.forbidden]:  'forbidden',
    [SQUARE_STATE.awaiting]:  'awaiting',
};


// FUNCIÓN QUE DEVUELVE UN TABLERO VACÍO
export const generateEmptyLayout = () => {
    return new Array(BOARD_ROWS * BOARD_COLUMNS).fill(SQUARE_STATE.empty);
};

// FUNCIÓN QUE NOS DEVUELVE UN INDICE DE LOS CUADRADOS CLICKADOS Y SUS COORDENADAS. 

export const indexToCoords = (index) => {
    return {
        x: index % BOARD_ROWS,
        y: Math.floor(index / BOARD_ROWS),
    };
};

export const coordsToIndex = (coordinates) => {
    const { x, y } = coordinates;

    return y * BOARD_ROWS + x;
};

//acá retorna las coordenadas(indices) de los barcos del jugador(entity) tomó
//por convención dentro del desarollo la manera de catalogar este tipo de información es como entidades/entity
export const entityIndices = (entity) => {
    let position = coordsToIndex(entity.position);

    let indices = [];

    for (let i = 0; i < entity.length; i++) {
        indices.push(position);
        position = entity.orientation === 'vertical' ? position + BOARD_ROWS : position +1;
    }

    return indices;
};

//con esto checkamos alternativas a la posición de los barcos(entidades). Esta función la ocupo con otras tres mas adelante (entityInPlace, placeCpuShipInLayout, updateSunkShip)
//La idea es ir viendo como 
export const entityIndicesCheker = (entity) => {
    let indices = [];
    for (let i = 0; i < entity.length; i++) {
        const position = 
            entity.orientation === 'vertical'
            ? coordsToIndex({ y: entity.position.y + i, x: entity.position.x })  //Se revisa que es lo que hay en estas posiciones 
            : coordsToIndex({ y: entity.position.y, x: entity.position.x + i});  //Se revisa que es lo que hay en estas posiciones
            indices.push(position);
    }
    return indices;
};


//ACÁ NOS ASEGURAMOS QUE LOS BARCOS SE SALGAN DEL TABLERO.
export const entityPositionCheker = (entity) => {
    return (
        (entity.orientation === 'vertical' && 
            entity.position.y + entity.length <= BOARD_ROWS) ||
        (entity.orientation === 'horizontal' &&
            entity.position.x + entity.length <= BOARD_COLUMNS)
    );
};

//CON ESTO PONEMOS UN BARCO (entity) en el tablero (Layout)
export const entityInLayout = (oldLayout, entity, type) => {
    let newLayout = oldLayout.slice();

    if (type === 'ship') {
        entityIndices(entity).forEach((idx) => {
            newLayout[idx] = SQUARE_STATE.ship;
        });
    }
    if (type === 'forbidden') {
        entityIndices(entity).forEach((idx) => {
            newLayout[idx] = SQUARE_STATE.forbidden;
        });
    }
    if (type === 'hit') {
        newLayout[coordsToIndex(entity.position)] = SQUARE_STATE.hit;
    }
    if (type === 'miss') {
        newLayout[coordsToIndex(entity.position)] = SQUARE_STATE.miss;
    }

    if (type === 'ship-sunk') {
        entityIndices(entity).forEach((idx) => {
            newLayout[idx] = SQUARE_STATE.ship_sunk;
        });
    }

    return newLayout;
};


// COMPRUEBA QUE LOS INDICES DE LAS NAVES (entity) TODAS CORRESPONDAN A CUADRADOS VACIOS. 
 export const entityInPlace = (entity, layout) => {
    let shipIndices = entityIndicesCheker(entity);

    return shipIndices.every((idx) => layout[idx] === SQUARE_STATE.empty);
 };

 

 // ESTO SE USA DURANTE EL POSICIONAMIENTO, PARA CALCULAR CUANTOS CUADRADOS UN BARCO ESTA SOBRESALIENDO(OVERHANG) DE LOS LÍMITES
 //LUEGO LA FUNCION PARA LA ADVERTENCIA Y EL CAMBIO DE COLOR. 
export const entityCalculateOverhang = (entity) =>
    Math.max(
        entity.orientation === 'vertical'
        ? entity.position.y + entity.length - BOARD_ROWS
        : entity.position.x + entity.length - BOARD_COLUMNS,
        0
    );

//REVISA SI EL BARCO QUE ESTOY TRATANDO DE PONER ESTA DENTRO DE LOS LÍMITES DEL TABLERO Y SI EL ESPACIO ESTÁ LIBRE.
//AMBAS CONDICIONES DEBEN REGRESAR TRUE!!!!!
export const entityCanBePlaced = (entity, layout) => 
        entityPositionCheker(entity) && entityInPlace(entity, layout);
       
// ACÁ SE GENERA EL TABLERO DE MANERA ALEATORIA DEL CPU. EL POSICIONAMIENTO DE LOS BARCOS Y SUS COORDENADAS.
//COMO RETORNO TENEMOS TODAS LOS BARCOS PARA LA PARTIDA DE LA COMPUTADORA.
export const computerEntityInPlace = (computerShips) => {
    let cpuLayout = generateEmptyLayout();

    return computerShips.map((ship) => {
        while (true) {
            let cpuDecoratedShip = randomizeShipProps(ship);
            if (entityCanBePlaced(cpuDecoratedShip, cpuLayout)) {
                cpuLayout = entityInLayout(cpuLayout, cpuDecoratedShip, SQUARE_STATE.ship);
                return {...cpuDecoratedShip, placed: true };
            }
        }
    });
};

//ACÁ SE GENERA UNA ORIENTACIÓN AL AZAR PARA LAS BARCAS DEL CPU
// SE GENERA AL AZAR TAMBIÉN UN PUNTO DE INCIO DENTRO DEL TABLERO
export const generateRandomOrientation = () => {
    let randomNumber = Math.floor(Math.random()* Math.floor(2));
    return randomNumber === 1 ? 'vertical' : 'horizontal';
};

export const generateRandomIndex = (value = BOARD) => {
    return Math.floor(Math.random() * Math.floor(value));
};

// ACA SE ASIGNA FINALMENTE A UN BARCO DEL CPU UNA ORIENTACIÓN Y COORDENADAS AL AZAR
// ESTA FUNCIÓN SE OCUPA CON computerEntityInPlace. 

export const randomizeShipProps = (ships) => {
    let randomStartIndex = generateRandomIndex();
    return {
        ...ships,
        position: indexToCoords(randomStartIndex),
        orientation: generateRandomOrientation(),
    };
};


//CON ESTA FUCNIÓN USAMOS LAS COORDENADAS DE INDICES DE POSISIONAMIETNO Y ORIENTACIÓN DE LOS BARCOS PREVIAMENTE RENDERIZADAS 
//LO QUE HACE ESTA FUNCIÓN ES OTORGARLE UN ESPACIO CORRECTO AL BARCO. QUE NO FALLE SU POSICION. 
export const placeCpuShipInLayout = (ship, cpuLayout) => {
    let newCpuLayout = cpuLayout.slice();
    entityIndicesCheker(ship).forEach((idx) => {
        newCpuLayout[idx] = SQUARE_STATE.ship;
    });
    return newCpuLayout;
};

//CON ESTO EL PC ATACA A CUADRADOS CERCANOS CUANDO ATACÓ EFECTIVAMENTE UN BARCO. 
//CON ESTO SE LE GENERA MAS FLUIDEZ Y MAYOR INTELIGENCIA AL CPU DE JUEGO.
export const nextCpuAttack = (coords) => {
    let firstRow = coords.y === 0;
    let lastRow = coords.y === 9;
    let firstColumn = coords.x === 0;
    let lastColumn = coords.x === 9;

    let cpuAttack = [];
    //LA PRIMERA FILA SERÍA coords.y === 0;
    if (firstRow) {
        cpuAttack.push(
            { x: coords.x + 1, y: coords.y }, 
            { x: coords.x - 1, y: coords.y }, 
            { x: coords.x, y: coords.y + 1 } 
        );
    }

    //LA ÚLTIMA FILA SERÍA coords.y === 9;
    if (lastRow) {
        cpuAttack.push(
            { x: coords.x + 1, y: coords.y }, 
            { x: coords.x - 1, y: coords.y }, 
            { x: coords.x, y: coords.y - 1 } 
        );
    }
    
    //LA PRIMERA COLUMNA SERÍA coords.x === 0;
    if (firstColumn) {
        cpuAttack.push(
            { x: coords.x + 1, y: coords.y }, //IZQUIERDA 
            { x: coords.x, y: coords.y + 1 },  //ABAJO
            { x: coords.x, y: coords.y - 1 } //ARRIBA
        );
    }
    
    //LA ÚLTIMA COLUMNA SERÍA coords.x === 9;
    if (lastColumn) {
        cpuAttack.push(
            { x: coords.x - 1, y: coords.y }, //DERECHA
            { x: coords.x, y: coords.y + 1 },  //ABAJO
            { x: coords.x, y: coords.y - 1 } //ARRIBA
        );
    }

    if(!lastColumn || !firstColumn || !lastColumn || !firstRow) {
        cpuAttack.push(
            { x: coords.x - 1, y: coords.y }, //DERECHA
            { x: coords.x + 1, y: coords.y }, //IZQUIERDA 
            { x: coords.x, y: coords.y + 1 },  //ABAJO
            { x: coords.x, y: coords.y - 1 } //ARRIBA
        );
    }

    let filteredResult = [
        ...new Set(
            cpuAttack
                .map((coords) => coordsToIndex(coords))
                .filter((number) => number >= 0 && number < BOARD)
        ),
    ];

    return filteredResult;
};

// CON ESTA FUNCIÓN SE ACTUALIZA EL ESTADO DEL BARCO SI ESTE FUE ATACADO CAMBIADNO SU COLOR. 
export const updateSunkShip = (currentHits, opponentShips) => {
    let playerHitIndices = currentHits.map((hit) => coordsToIndex(hit.position));
    let indexWasHit = (index) => playerHitIndices.includes(index);
    let shipWithSunk = opponentShips.map((ship) => {
        let shipIndices = entityIndicesCheker(ship);
        if (shipIndices.every((idx) => indexWasHit(idx))) {
            return { ...ship, sunk: true};
        } else {
            return { ...ship, sunk: false };
        }
    });
    return shipWithSunk;
};


console.log(coordsToIndex);