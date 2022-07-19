import React from "react";
import PlayerFleet from './PlayerFleet';
import PlayerBoard from './PlayerBoard';
import ComputerBoard from './ComputerBoard';
import PlayerScore from './PlayerScore';

const GameView = ({  //Varios de estos son hooks o funciones qeu estan en Game.jsx
    availableShips,
    selectShip,
    currentPlace,
    setCurrentPlace,
    rotateShip,
    placeShip,
    placedShips,
    startTurn,
    computerShips,
    gameState,
    changeTurn,
    hitComputer,
    hitsByPlayer,
    setHitsByPlayer,
    hitsByComputer,
    handleComputerTurn,
    checkIfGameOver,
    winner,
    startAgain,
    setComputerShips,
}) => {
    return ( // se retorna un div con los componentes para hacer el vista del juego. 
        <section id="game-screen">
            {gameState !== 'placement' ? (
                <PlayerScore
                    gameState={gameState}
                    hitsByPlayer={hitsByPlayer}
                    hitsByComputer={hitsByComputer}
                    startAgain={startAgain}
                    winner={winner}
                />
            ) : (
                <PlayerFleet
                    availableShips={availableShips}
                    selectShip={selectShip}
                    currentPlace={currentPlace}
                    startTurn={startTurn}
                    startAgain={startAgain}
                />
            )}

            <PlayerBoard
                currentPlace={currentPlace}
                setCurrentPlace={setCurrentPlace}
                rotateShip={rotateShip}
                placeShip={placeShip}
                placedShips={placedShips}
                hitsByComputer={hitsByComputer}
            />

            <ComputerBoard
                computerShips={computerShips}
                setComputerShips={setComputerShips}
                hitsByPlayer={hitsByPlayer}
                setHitsByPlayer={setHitsByPlayer}
                gameState={gameState}
                changeTurn={changeTurn}
                hitComputer={hitComputer}
                handleComputerTurn={handleComputerTurn}
                checkIfGameOver={checkIfGameOver}
            />
        </section>
    );
};

export default GameView;