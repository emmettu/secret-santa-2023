import { useEffect, useState, useContext } from 'react';
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { TypeAnimation } from 'react-type-animation';

import './Guess.css';
import Players from './Players';
import { GameClientContext } from './GameClientContext';

function Guess() {

  // const { sendMessage, lastMessage, readyState } = useWebSocket(`wss://${window.location.host}/ws`);
  // const { sendMessage, lastMessage, readyState } = useWebSocket(`ws://${window.location.host}/ws`);
  // const { sendMessage, lastMessage, readyState } = useWebSocket("ws://localhost:5000/ws");

  const [guess, setGuess] = useState("");
  const [hints, setHints] = useState();
  const [countries, setCountries] = useState([]);
  
  const { registerHintCallback, registerCountriesCallback, submitGuess, registerResultsCallback, requestState } = useContext(GameClientContext);

  const navigate = useNavigate();

  useEffect(() => {
    registerHintCallback((hint) => {
      setHints(hint);
    });
  }, [registerHintCallback, setHints]);

  useEffect(() => {
    registerCountriesCallback((countries) => {
      const options = countries.map(c => ({ value: c.id, label: c.name }));
      setCountries(options);
    });
  }, [registerCountriesCallback, setCountries]);

  useEffect(() => {
    registerResultsCallback((_results) => {
      navigate("/results");
    });
  }, [registerResultsCallback, navigate]);

  useEffect(() => {
    console.log("REQUESTING NEW STATE");
    requestState();
  }, [requestState]);

  // useEffect(() => {
  //   const fingerprint = getBrowserFingerprint().toString();
  //   setClientId(fingerprint);
  // }, [setClientId]);

  // useEffect(() => {
  //   if (clientId != null) {
  //     const registration = { clientId: clientId, roomId: 123 };
  //     sendMessage(JSON.stringify(registration));
  //   }
  // }, [sendMessage, clientId]);

  // useEffect(() => {
  //   if (lastMessage != null) {
  //     console.log(lastMessage.data);
  //     const message = JSON.parse(lastMessage.data);

  //     if (message.hint != null) {
  //       setHint([...hint, message.hint]);
  //       console.log(hint)
  //     }

  //     if (message.correct != null) {
  //       console.log(message.correct ? "You got the right answer!" : "You got the wrong answer!");
  //     }
  //   }
  // }, [lastMessage, setHint]);

  const handleSubmit = (event) => {
    event.preventDefault();
    submitGuess(guess);
  }

  return (
    <div className="Guess">
      <h1>Round 1</h1>
      <div className="Hint" style={{ textAlign: 'left'}}>
        {hints && <TypeAnimation
          sequence={[hints]}
          speed={60}
          cursor={true}
          style={{whiteSpace: 'pre-line'}}
        />}
      </div>
      <form onSubmit={handleSubmit}>
        <label>
          <Select isSearchable={true} options={countries} onChange={choice => setGuess(choice.value)}></Select>
          <input className="SubmitButton" type="submit" value="Guess"/>
        </label>
      </form>
      <Players />
    </div>
  );
}

export default Guess;
