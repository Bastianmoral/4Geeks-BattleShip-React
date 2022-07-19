import React from "react";

const PlayerScore =  ({
    gameState,
    hitsByPlayer,
    hitsByComputer,
    startAgain,
    winner,
}) => {
    let numberOfHits = hitsByPlayer.length;
    let numberOfSuccessfulHits = hitsByPlayer.filter((hit) => hit.type === 'hit').length;
    let accuracyScore = Math.round(100 * (numberOfSuccessfulHits / numberOfHits ));
    let succesfulComputerHits = hitsByComputer.filter((hit) => hit.type === 'hit').length;

    let gameOverPanel = (
        <div>
            <div className="tip-box-title">Juego Terminado</div>
            <p className="player-score">
                {winner === 'player' ? 'GANASTEEEEE!!! 🎉' : 'HAS PERDIDO 😭. Intentalo de nuevo.'}
            </p>
            <button onClick={startAgain}>
                Juega otra partida. 
            </button>
        </div>
    );

    let scorePanel = (
        <div>
            <div className="score-box-title">Estadísticas</div>
            <div id="firing-info">
                <ul>
                    <li>{numberOfSuccessfulHits} Ataques en el blanco.</li>
                    <li>{accuracyScore > 0 ? `${accuracyScore}%` : `0%`} Porcentaje de precisión de tus ataques.</li>
                </ul>
                <p className="player-tip">El primero en hundir los 5 barcos del oponente es el ganador.</p>
                <button onClick={startAgain}> Reestablecer partida </button>
            </div>
        </div>
    );

    return (
        <div id="player-score">
            {numberOfSuccessfulHits === 17 || succesfulComputerHits === 17
                ? gameOverPanel
                : scorePanel}
        </div>
    );
};

export default PlayerScore;