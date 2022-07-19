import React from 'react';
 
const WelcomeScreen = ({ startPlay }) => {
  return (
    <main>
      <h2 className="tip-box-title">Reglas</h2>
      <p className="player-tip">
      Tú y tu oponente son comandantes navales. Sus 
      flotas están posicionadas en coordenadas secretas, 
      y se turnan para disparar cañones el uno al otro. 
      El primero en hundir toda la flota de la otra persona ¡gana!
      Diviertete.
      </p>
      <button onClick={startPlay}>Comenzar</button>
    </main>
  );
};


export default WelcomeScreen;