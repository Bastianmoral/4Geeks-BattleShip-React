import React from "react";
import {
    stateToClass,
    generateEmptyLayout,
    entityInLayout,
    SQUARE_STATE,
    indexToCoords,
    updateSunkShip,
} from './layoutEntity'


//COMPONENTE QUE MANEJA TODO LO RELACIONADO AL SEGUNDO TABLERO CORRESPONDIENTE AL CPU.
const ComputerBoard = ({
    computerShips,
    setComputerShips,
    gameState,
    hitsByPlayer,
    setHitsByPlayer,
    handleComputerTurn, 
    checkIfGameOver,
}) => {
    // Función para poner barcos en un layout vacío 
    let cpuLayout = computerShips.reduce(
        (prevLayout, currentShip) => 
            entityInLayout(prevLayout, currentShip, SQUARE_STATE.ship),
        generateEmptyLayout()    
    );

    // Función para recibir un ataque realizado por el jugador
    //un cualquier parte del layout
        cpuLayout = hitsByPlayer.reduce(
            (prevLayout, currentHit) => 
                entityInLayout(prevLayout, currentHit, currentHit.type),
            cpuLayout
        );
        
        cpuLayout = computerShips.reduce(
            (prevLayout, currentShip) => 
                currentShip.sunk 
                ? entityInLayout(prevLayout, currentShip, SQUARE_STATE.ship_sunk) 
                : prevLayout,
            cpuLayout
        );

// Función para ver que hay en el cuadrado y decidir que hacer posteriormente.
    const cpuAttack = (i) => {
        if (cpuLayout[i] === 'ship') {
            const newHits = [
                ...hitsByPlayer,
                {
                    position: indexToCoords(i),
                    type: SQUARE_STATE.hit,
                },
            ];
            setHitsByPlayer(newHits);
            return newHits;
        }
        if (cpuLayout[i] === 'empty') {
            const newHits = [
                ...hitsByPlayer,
                {
                    position: indexToCoords(i),
                    type: SQUARE_STATE.miss,
                },
            ];
            setHitsByPlayer(newHits);
            return newHits;
        }
    };

    const playerTurn = gameState === 'player-turn';
    const playerCanFire = playerTurn && !checkIfGameOver();

    let alreadyHit = (i) => 
        cpuLayout[i] === 'hit' ||
        cpuLayout[i] === 'miss' ||
        cpuLayout[i] === 'ship-sunk';
    
        let cpuSqueares = cpuLayout.map((square, index) => {
            return (
                <div
/* SOLO SE MOSTRARAN LOS CUADADOS QUE ESTEN ATACADOS, TANTO CON FALLAS O CON ACIERTOS Y SI HAY UN BARCO HUNDIDO */
                    className=
                    {
                        stateToClass[square] === 'hit' ||
                        stateToClass[square] === 'miss' ||
                        stateToClass[square] === 'ship-sunk'
                            ? `square ${stateToClass[square]}`
                            : `square`
                    }
                    key={`cpu-square-${index}`}
                    id={`cpu-square-${index}`}
                    onClick={() => {
                        if (playerCanFire && !alreadyHit(index)) {
                            const newHits = cpuAttack(index);
                            const shipWithSunk = updateSunkShip(newHits, computerShips);
                            const sunkShipAfter = shipWithSunk.filter((ship) => ship.sunk).length;
                            const sunkShipBefore = computerShips.filter((ship) => ship.sunk).length;
                            if (sunkShipAfter > sunkShipBefore) {
                                alert('Has Hundido un barco enemigo');
                            }
                            setComputerShips(shipWithSunk);
                            handleComputerTurn();
                        }
                    }}
                />
            );
        })
        return (
            <div>
                <h2 className="player-title">Computadora</h2>
                <div className="board">{cpuSqueares}</div>
            </div>
        );
};


export default ComputerBoard;