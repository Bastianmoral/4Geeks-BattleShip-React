import React from "react";
import {
    SQUARE_STATE,
    stateToClass,
    generateEmptyLayout,
    entityInLayout,
    indexToCoords,
    entityCalculateOverhang,
    entityCanBePlaced,

} from './layoutEntity';

const PlayerBoard = ({
    currentPlace,
    setCurrentPlace,
    rotateShip,
    placeShip,
    placedShips,
    hitsByComputer,
}) => {

    let layout = placedShips.reduce(
      (prevLayout, currentShip) => 
        entityInLayout(prevLayout, currentShip, SQUARE_STATE.ship),
        generateEmptyLayout()
    );
    
    layout = hitsByComputer.reduce(
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

    const isPlacingOverBoard = currentPlace && currentPlace.position != null;
    const canPlaceCurrentShip = isPlacingOverBoard && entityCanBePlaced(currentPlace, layout);

    if(isPlacingOverBoard) {
        if (canPlaceCurrentShip) {
            layout = entityInLayout(layout, currentPlace, SQUARE_STATE.ship);
        } else {
            let forbiddenShip = {
                ...currentPlace,
                length: currentPlace.length - entityCalculateOverhang(currentPlace),
            };
            layout = entityInLayout(layout, forbiddenShip, SQUARE_STATE.forbidden);

        }
    }

    let squares = layout.map((square, index) => {
        return (
            <div
                onMouseDown={rotateShip}
                onClick={() => {
                    if(canPlaceCurrentShip) {
                        placeShip(currentPlace);
                    }
                }}
                className={`square ${stateToClass[square]}`}
                key={`square-&{index}`}
                id={`square-&{index}`}
                onMouseOver={() => {
                    if(currentPlace) {
                        setCurrentPlace({
                            ...currentPlace,
                            position: indexToCoords(index),
                        });
                    }
                }}
            />
        );
    });

    return (
        <div>
            <h2 className='player-title'>Tu</h2>
            <div className='board'>{squares}</div>
        </div>
    );
};

export default PlayerBoard;
