import React from 'react';
 
const WelcomeScreen = ({ startPlay }) => {
  return (
    <main>
      <h2 className="tip-box-title">Como jugar?</h2>
      <p className="player-tip">
      Tú y tu oponente son comandantes navales. 
      <br></br> 
      Sus flotas están posicionadas en coordenadas secretas, 
      y se turnan para disparar cañones el uno al otro.
      <br></br> 
      <br></br>  
      Para comenzar a jugar Clickea sobre el barco que quieres posicionar
      <br></br> 
      luego, dejalo en la posición deseada en tu tablero
      <br></br> 
      Si quieres cambiar la orientación de tu barco entre horizontal y vertical debes hacer click derecho.
      <br></br> 
      Una vez posicionada toda tu flota debes hacer click en "A jugar".
      <br></br> 
      <strong>Tu siempre tendrás el primer turno para atacar el tablero enemigo</strong>
      <br></br> 
      El primero que logré derribar las flota completa del oponente gana.
      <br></br> 
      Diviertete!!

      </p>
      <button onClick={startPlay}>Comenzar</button>
    </main>
  );
};


export default WelcomeScreen;