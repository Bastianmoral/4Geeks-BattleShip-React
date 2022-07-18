import React from "react";
import PlayerFleet from './PlayerFleet';
import PlayerBoard from './PlayerBoard';
import ComputerBoard from './ComputerBoard';
import PlayerTips from './PlayerTips';

const GameView = ({}) => {
    return (
        <section id="game-screen">
            {gameState !== 'placement' ? (
                <PlayerTips
                    gameState={gameState}
                    hitsByPlayer={hitsByPlayer}
                    hitsByComputer={hitsByComputer}
                    winner={winner}
                    startAgain={startAgain}
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
                hitByComputer={hitByComputer}
            />

            <ComputerBoard
                computerShips={computerShips}
                changeTurn={changeTurn}
                gameState={gameState}
                hitComputer={hitComputer}
                hitByPlayer={hitByPlayer}
                setHitsByPlayer={setHitsByPlayer}
                handleComputerTurn={handleComputerTurn}
                checkIfGameOver={checkIfGameOver}
                setComputerShips={setComputerShips}
            />
        </section>
    );
};

export default GameView;