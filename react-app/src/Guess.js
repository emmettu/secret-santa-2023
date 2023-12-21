import useWebSocket from 'react-use-websocket';
import { useEffect, useState } from 'react';
import getBrowserFingerprint from 'get-browser-fingerprint';

import Players from './Players';

function Guess() {

  // const { sendMessage, lastMessage, readyState } = useWebSocket(`wss://${window.location.host}/ws`);
  const { sendMessage, lastMessage, readyState } = useWebSocket(`ws://${window.location.host}/ws`);
  // const { sendMessage, lastMessage, readyState } = useWebSocket("ws://localhost:5000/ws");

  const [guess, setGuess] = useState("");
  const [hint, setHint] = useState([]);
  const [clientId, setClientId] = useState(null);

  useEffect(() => {
    const fingerprint = getBrowserFingerprint().toString();
    setClientId(fingerprint);
  }, [setClientId]);

  useEffect(() => {
    if (clientId != null) {
      const registration = { clientId: clientId, roomId: 123 };
      sendMessage(JSON.stringify(registration));
    }
  }, [sendMessage, clientId]);

  useEffect(() => {
    if (lastMessage != null) {
      console.log(lastMessage.data);
      const message = JSON.parse(lastMessage.data);

      if (message.hint != null) {
        setHint([...hint, message.hint]);
        console.log(hint)
      }

      if (message.correct != null) {
        console.log(message.correct ? "You got the right answer!" : "You got the wrong answer!");
      }
    }
  }, [lastMessage, setHint]);

  const handleSubmit = (event) => {
    const guessRequest = { clientId: clientId, guess: guess };
    sendMessage(JSON.stringify(guessRequest));
    event.preventDefault();
  }

  return (
    <div className="Guess">
      {hint.map((hintText) => {
        return <p>
          { hintText }
        </p>
      })}
      <form onSubmit={handleSubmit}>
        <label>
          <input type="text" onChange={(e) => {setGuess(e.target.value)}}></input>
          <input type="submit" value="Guess"/>
        </label>
      </form>
      <Players />
    </div>
  );
}

export default Guess;
