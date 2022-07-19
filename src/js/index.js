//import react into the bundle
import React, { useState } from "react";
import ReactDOM from "react-dom";
import  WelcomeScreen  from './component/WelcomeScreen.js'
import  Header  from './component/Header.js';
import  Footer  from './component/Footer.js';
import Game from "./game/Game.js";
import "../styles/board.css";
import "../styles/open-color.css";
import "../styles/replicas.css";
import "../styles/style.css";

const App = () => {
    const [appState, setAppState] = useState('welcome')
    const startPlay = () => {
        setAppState('play');
    };
    return (
        <React.Fragment>
            <Header />
            {appState === 'play' ? <Game /> : <WelcomeScreen startPlay={startPlay} />}
            <Footer />
        </React.Fragment>
    );
};

//render your react application
ReactDOM.render(<App />, document.querySelector("#app"));
