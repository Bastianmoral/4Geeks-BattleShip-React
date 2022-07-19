import Reac from "react";
import ReplicaBoard from "./ReplicaBoard";

//Con este componente nos retoruna una pequeña replica de un barco y su nombre. 

const getReplicaEntity = (availableShips, shipName, selectShip) => {
    let ship = availableShips.find((item) => item.name === shipName);
    let shipLength = new Array(ship.length).fill('ship');
    let allReplicaSquares = shipLength.map((item, index) => (
        <div className="small-square" key={index} />
    ));

    return (
        <ReplicaBoard
        key={shipName}
        selectShip={selectShip}
        shipName={shipName}
        squares={allReplicaSquares}
        />
    );
};

export default getReplicaEntity