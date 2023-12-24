import { useEffect, useRef, useState, useCallback } from 'react';
import useWebSocket from 'react-use-websocket';
import getBrowserFingerprint from 'get-browser-fingerprint';

function useGameClient() {
  const { sendMessage, lastMessage, readyState } = useWebSocket(`wss://${window.location.host}/ws`);
  //  const { sendMessage, lastMessage, readyState } = useWebSocket(`ws://${window.location.host}/ws`);
  // const { sendMessage, lastMessage, readyState } = useWebSocket("ws://localhost:5000/ws", { shouldReconnect: (_event) => true });

  const clientId = useRef(getBrowserFingerprint().toString());
  const hintCallbacks = useRef([]);
  const correctCallbacks = useRef([]);
  const clientCallbacks = useRef([]);
  const countriesCallbacks = useRef([]);
  const resultsCallbacks = useRef([]);

  const [lastResults, setLastResults] = useState(null);
  const [lastAnswer, setLastAnswer] = useState(null);

  const registerHintCallback = useCallback((callback) => {
    hintCallbacks.current.push(callback);
  }, []);

  const registerCorrectCallback = useCallback((callback) => {
    correctCallbacks.current.push(callback);
  }, []);

  const registerClientCallback = useCallback((callback) => {
    clientCallbacks.current.push(callback);
  }, []);

  const registerCountriesCallback = useCallback((callback) => {
    countriesCallbacks.current.push(callback);
  }, []);

  const registerResultsCallback = useCallback((callback) => {
    resultsCallbacks.current.push(callback);
  }, []);

  const getOtherResults = useCallback(() => {
    const otherResults = [];
    Object.keys(lastResults).map(k => {
      if (k !== clientId.current) {
        otherResults.push(lastResults[k]);
      }
    });
    return otherResults;
  }, [lastResults]);

  const getYourResult = useCallback(() => {
    return lastResults[clientId.current];
  }, [lastResults]);

  const joinRoom = useCallback((name) => {
    const registration = { name: name, clientId: clientId.current, roomId: 123 };
    sendMessage(JSON.stringify(registration));
  }, [sendMessage]);

  const submitGuess = useCallback((guess) => {
    const guessRequest = { clientId: clientId.current, guess: guess };
    sendMessage(JSON.stringify(guessRequest));
  }, [sendMessage]);

  useEffect(() => {
    if (lastMessage == null) {
        return;
    }
    const message = JSON.parse(lastMessage.data);

    if (message.hint != null) {
      hintCallbacks.current.forEach(cb => {
        cb(message.hint);
      });
    }

    if (message.correct != null) {
      correctCallbacks.current.forEach(cb => {
        cb(message.correct);
      });
    }

    if (message.clients != null) {
      clientCallbacks.current.forEach(cb => {
        cb(message.clients);
      });
    }

    if (message.countries != null) {
      countriesCallbacks.current.forEach(cb => {
        cb(message.countries);
      });
    }

    if (message.results != null) {
      console.log(JSON.stringify(message.results));
      setLastResults(message.results);
      resultsCallbacks.current.forEach(cb => {
        cb(message.results);
      });
    }

    if (message.answer != null) {
      console.log("ANSEWR IS: " + message.answer);
      setLastAnswer(message.answer);
    }
  }, [lastMessage, setLastResults, setLastAnswer]);

  return {
    submitGuess,
    joinRoom,
    registerCountriesCallback,
    registerHintCallback,
    registerCorrectCallback,
    registerClientCallback,
    registerResultsCallback,
    getOtherResults,
    getYourResult,
    lastAnswer,
  }
}

export default useGameClient;