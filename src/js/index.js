//import react into the bundle
import React, { useState } from "react";
import ReactDOM from "react-dom";
import  WelcomeScreen  from './component/WelcomeScreen.jsx'
import  Header  from './component/Header.jsx';
import  Footer  from './component/Footer.jsx';
import Home from "./component/home.jsx";
import "../styles/index.css";

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
