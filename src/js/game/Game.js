import React, {useState, useRef } from 'react';
import GameView from './GameView';
import {
    computerEntityInPlace,
    SQUARE_STATE,
    indexToCoords,
    entityInLayout,
    generateEmptyLayout,
    generateRandomIndex,
    nextCpuAttack,
    updateSunkShip,
    coordsToIndex,
} from './layoutEntity';

const FLEET =[   /* objetos para hacer las diferentes naves que se usaran en el juego. */
    {
        name: 'buque',
        length: 5,
        placed: null,
    },
    {
        name: 'acorazado',
        length: 4,
        placed: null,
    },
    {
        name: 'crucero',
        length: 3,
        placed: null,
    },
    {
        name: 'submarino',
        length: 3,
        placed: null,
    },
    {
        name: 'destructor',
        length: 2,
        placed: null,
    },
];

const Game = () => {
    const [gameState, setGameState] = useState('placement'); // determina el turno y el comienzo del juego.
    const [winner, setWinner] = useState(null); //determina al ganador      
    const [currentPlace, setCurrentPlace] = useState(null); //  determina la ubicación
    const [placedShips, setPlacedShips] = useState([]); // determina las ubicaciones ya elegidas por el usuario
    const [availableShips, setAvailableShips] = useState(FLEET); // determina los barcos disponibles
    const [computerShips, setComputerShips] = useState([]);  // determina las naves disponibles de la computadora
    const [hitsByComputer, setHitsByComputer] = useState([]);  // determina los ataques de parte de la coputadora
    const [hitsByPlayer, setHitsByPlayer] = useState([]);  // determina los ataques de parte del jugador. 

    // TODAS LAS FUNCIONES CORRESPONDIENTES AL JUGADOR
// ** JUGADOR **

    const selectShip = (shipName) => { //Funcion de selección
        let shipIdx = availableShips.findIndex((ship) => ship.name == shipName); //Muestra los barcos disponibles y los ordena después de la selección.
        const shipToPlace = availableShips[shipIdx];
        setCurrentPlace({
            ...shipToPlace,
            orientation: 'horizontal',
            position: null,
        });
    };

    const placeShip = (currentPlace) => { // Función que determina cual son los lugares que el suaurio a elegido. 
        setPlacedShips([
            ...placedShips,
            {
                ...currentPlace,
                place: true,
            },
        ]);

        setAvailableShips((previousShips) => 
            previousShips.filter((ship) => ship.name !== currentPlace.name)
            );
            
            setCurrentPlace(null);
    };

    const rotateShip = (e) => { //Función que permite al usuario rotar el barco para su posición
        if (currentPlace != null && e.button === 2) {
            setCurrentPlace({
                ...currentPlace,
                orientation:
                    currentPlace.orientation === 'vertical' ? 'horizontal' : 'vertical',
            });
        }
    };

    const startTurn = () => { //Función para comenzar el turno de cada jugador. 
        generateComputerShips();
        setGameState('player-turn');
    };

    const changeTurn = () => { // Función que detemrinam el cambio de turno
        setGameState((oldGameState) => 
            oldGameState === 'player-turn' ? 'computer-turn' : 'player-turn'
        );
    };

// TODAS LAS FUNCIONES CORRESPONDIENTES A LA COPUTADORA
// ** COMPUTADORA **
    const generateComputerShips = () => { // fucnión que genera la posición de las naves de la computadora. 
        let placeComputerShip = computerEntityInPlace(FLEET.slice());
        setComputerShips(placeComputerShip);
    };

    const computerAttack = (index, layout) => { // función del ataque del oponente
        let computerHits; // determinamos el ataque del oponente

        if (layout[index] === 'ship') {  // En este if es para la opción de que si el ataque de la computadora dió en una nave enemiga. 
            computerHits = [
                ...hitsByComputer,
                {
                    position: indexToCoords(index),
                    type: SQUARE_STATE.hit,
                },
            ];
        }
        if (layout[index] === 'empty') {  // En este if es para la opción de que si el ataque de la computadora dió en una nave enemiga. 
            computerHits = [
                ...hitsByComputer,
                {
                    position: indexToCoords(index),
                    type: SQUARE_STATE.miss,
                },
            ];
        }

        const sunkShips = updateSunkShip(computerHits, placedShips);
        const sunkShipsAfter = sunkShips.filter((ship) => ship.sunk).length;
        const sunkShipsBefore = placedShips.filter((ship) => ship.sunk).length;
        if (sunkShipsAfter > sunkShipsBefore) {
            alert('Te han hundido un barco');
        }
        setPlacedShips(sunkShips);
        setHitsByComputer(computerHits);
    };

// ** FUNCION BIEN COMPLICADA **
// Función que pasa del turno del jugador al oponente (computadora). Chequea si el juego temrinó y para de ser así
// Si el juego continua hace disparo a un cuadrado disponible y temrina su turno. 
    const handleComputerTurn = () => { //Con esta función comienza el turno de la computadora(oponente)
        changeTurn();

        if (checkIfGameOver()) { // se chekea si el juego temrinó 
            return;
        }

        // CON ESTA FUNCIÓN REVISA TODO EL LAYOUT PARA BUSCAR UN CUADRADO DISPONIBLE. 
        let layout = placedShips.reduce( // Se hace una revisión del layout con los barcos puestos-
            (prevLayout, currentShip) => 
                entityInLayout(prevLayout, currentShip, SQUARE_STATE.ship),
            generateEmptyLayout()
        );

        layout = hitsByComputer.reduce( //se determina si la computadora logró o no atacar al jugador. 
            (prevLayout, currentHit) => 
                entityInLayout(prevLayout, currentHit, currentHit.type),
            layout
        );

        layout = placedShips.reduce(
            (prevLayout, currentShip) => 
                currentShip.sunk 
                ? entityInLayout(prevLayout, currentShip, SQUARE_STATE.ship_sunk)
                : prevLayout,
            layout
        );

        let succesfulComputerHits = hitsByComputer.filter((hit) => hit.type === 'hit'); // un ataque exitoso
        let nonSunkComputerHits = succesfulComputerHits.filter((hit) => { // sin embargo el ataque no hunde el barco pero si le hizo daño.
            const hitIndex = coordsToIndex(hit.position);
            return layout[hitIndex] === 'hit';
        });

        let potentialTargets = nonSunkComputerHits
        .flatMap((hit) => nextCpuAttack(hit.position))
        .filter((idx) => layout[idx] === 'empty' || layout[idx] === 'ship');

        // función para cuando el computador acierta un ataque. 
        if (potentialTargets.length === 0) {
            let layoutindex = layout.map((item, idx) => idx);
            potentialTargets = layoutindex.filter(
                (index) => layout[index] === 'ship' || layout[index] === 'empty'
            );
        }

        let randomIndex = generateRandomIndex(potentialTargets.length);
        let target = potentialTargets[randomIndex];

        setTimeout(() => {
            computerAttack(target, layout);
            changeTurn();
        }, 300);
    };
 

// *** Final del juego ***
// funciones para el final del juego y determinar ganadores. 
    const checkIfGameOver = () => { // función con la que se chekea si se terminó el juego
        let successfulPlayerHits = hitsByPlayer.filter((hit) => hit.type === 'hit').length;
        let successfulComputerHits = hitsByPlayer.filter((hit) => hit.type === 'hit').length;

        if (successfulComputerHits === 17 || successfulPlayerHits === 17) {
            setGameState('game-over');

            if(successfulComputerHits === 17) { // alerta por si perdiste
                setWinner('computer');
            }
            if (successfulPlayerHits === 17) { // alerta por si gana el jugador
                setWinner('player');
            }
            return true;
        }

        return false;
    };

    const startAgain = () => { // función que nos permite volver a jugar. 
        setGameState('placement');
        setWinner(null);
        setCurrentPlace(null);
        setPlacedShips([]);
        setAvailableShips(FLEET);
        setComputerShips([]);
        setHitsByComputer([]);
        setHitsByPlayer([]);
    };

    return (
        <React.Fragment>
            <GameView 
                availableShips={availableShips}
                selectShip={selectShip}
                currentPlace={currentPlace}
                setCurrentPlace={setCurrentPlace}
                rotateShip={rotateShip}
                placeShip={placeShip}
                placedShips={placedShips}
                startTurn={startTurn}
                computerShips={computerShips}
                gameState={gameState}
                changeTurn={changeTurn}
                hitsByPlayer={hitsByPlayer}
                setHitsByPlayer={setHitsByPlayer}
                hitsByComputer={hitsByComputer}
                setHitsByComputer={setHitsByComputer}
                handleComputerTurn={handleComputerTurn}
                checkIfGameOver={checkIfGameOver}
                startAgain={startAgain}
                winner={winner}
                setComputerShips={setComputerShips}
            />
        </React.Fragment>
    );
};

export default Game;

