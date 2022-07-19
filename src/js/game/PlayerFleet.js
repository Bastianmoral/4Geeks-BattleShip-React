import React from "react";
import ReplicaBoard from './ReplicaBoard';

//fleet es flota en ingles. Para mayor entendimiento. 
//CON ESTE COMPONENTE SE DETERMINA LA FLOTA DEL USUARIO O JUGADOR
//SE DETERMINA CUANTOS BARCOS QUEDAN Y LAS POSICIONES INCIALES DE LOS BARCOS POR PARTE DEL JUGADOR.

const PlayerFleet = ({  // Función que determina la flota del usuario acá ocupamos los hooks creados en Game.jsx
    selectShip, //función del jugador
    currentPlace, //Hook
    startTurn,//funcion del jugador
    startAgain, //función para volver a comenzar el juego. 
    availableShips,

}) => {
    let shipsLeft = availableShips.map((ship) => ship.name); // se mapea cuantos barcos quedan al jugador
    // POR CADA BARCO AÚN DISPONIBLE. SE RETORNA UNA ReplicaBox con el nombre de las barcas y cuantos cuadrados tiene de largo.
    let shipReplicaBoxes = shipsLeft.map((shipName) => ( // se mapea cuantos barcos le quedan al cpu
        <ReplicaBoard 
            selectShip={selectShip}
            key={shipName}
            currentPlace={currentPlace && currentPlace.name === shipName}
            shipName={shipName}
            availableShips={availableShips}
        />
    ));

    let fleet = ( // Se determina cual es la flota acutal del jugador. 
        <div id="replica-fleet">
            {shipReplicaBoxes}
            <p className="player-tip">Click Derecho para rotar la dirección de la posición de tu barco.</p>
            <button className="restart" onClick={startAgain}>
                Reestablecer
            </button>
        </div>

    );

    let playButton = ( // Función para comenzar a jugarm y confirmar posición de flota. 
        <div id='play-ready'>
            <p className='player-tip'> Toda tu flota está en formación.</p>
            <button id='play-button' onClick={startTurn}>
                A jugar. 
            </button>
        </div>
    );
    
    return ( //FINALMENTE TENEMOS EL RETORNO CON LA FLOTA DISPONIBLE. 
        <div id="available-ships">
        <div className="tip-box-title"> Tu Flota</div>
            {availableShips.length > 0 ? fleet : playButton}
        </div>
    );
};

export default PlayerFleet;