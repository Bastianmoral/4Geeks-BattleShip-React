import React from "react";
import ReplicaBox from './ReplicaBox';

//CON ESTE COMPONENTE SE DETERMINA LA FLOTA DEL USUARIO O JUGADOR
//SE DETERMINA CUANTOS BARCOS QUEDAN Y LAS POSICIONES INCIALES DE LOS BARCOS POR PARTE DEL JUGADOR.

const PlayerFleet = ({  // Función que determina la flota del usuario
    availableShips,
    selectShip,
    currentPlace,
    startTurn,
    startAgain,

}) => {
    let shipsLeft = availableShips.map((ship) => ship.name); // se mapea cuantos barcos quedan al jugador
    let shipReplicaBoxes = shipsLeft.map((shipName) => ( // se mapea cuantos barcos le quedan al cpu
        <ReplicaBox 
            selectShip={selectShip}
            key={shipName}
            isCurrentPlaced={isCurrentPlaced && currentPlace.name === shipName}
            shipName={shipName}
            availableShips={availableShips}
        />
    ));

    let fleet = ( // Se determina cual es la flota acutal del jugador. 
        <div id="replica-fleet">
            {shipReplicaBoxes}
            <p className="player-tip">Click Derecho para rotar la dirección de la posisicón de tu barco.</p>
            <p className="restart" onClick={startAgain}>
                Restart
            </p>
        </div>

    );

    let playButton = ( // Función para comenzar a jugarm y confirmar posición de flota. 
        <div id='play-ready'>
            <p className='player-tip'> Toda tu flota está en formación.</p>
            <button id='play-button' onclick={startTurn}>
                A jugar. 
            </button>
        </div>
    );
    
    return (
        <div id="available-ships">
        <div className="tip-box-title"> Tu Flota</div>
            {availableShips.length > 0 ? fleet : playButton}
        </div>
    );
};

export default PlayerFleet;