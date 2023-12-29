import { useEffect, useRef, useState, useCallback } from 'react';
import useWebSocket from 'react-use-websocket';
import getBrowserFingerprint from 'get-browser-fingerprint';

function useGameClient() {
  // const { sendMessage, lastMessage, readyState } = useWebSocket(`ws://${window.location.host}/ws`, { shouldReconnect: (_event) => true } );
  const { sendMessage, lastMessage, readyState } = useWebSocket(`wss://${window.location.host}/ws`, { shouldReconnect: (_event) => true } );
  // const { sendMessage, lastMessage, readyState } = useWebSocket("ws://localhost:5000/ws", { shouldReconnect: (_event) => true });

  const [hint, setHint] = useState("");
  const [countries, setCountries] = useState([]);
  const [lastChat, setLastChat] = useState(null);
  const [lastResults, setLastResults] = useState(null);
  const [lastAnswer, setLastAnswer] = useState(null);
  const [page, setPage] = useState("");
  const [standings, setStandings] = useState([]);
  const [round, setRound] = useState(0);
  const [room, setRoom] = useState("");

  const clientId = useRef(getBrowserFingerprint().toString());

  const readChat = () => {
    const message = lastChat;
    setLastChat(null);
    return message;
  }

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

  const joinRoom = useCallback((name, room) => {
    const registration = { name: name, clientId: clientId.current, roomId: room };
    sendMessage(JSON.stringify(registration));
  }, [sendMessage]);

  const startGame = useCallback(() => {
    const registration = { clientId: clientId.current, start: "please" };
    sendMessage(JSON.stringify(registration));
  }, [sendMessage]);

  const requestState = useCallback(() => {
    sendMessage(JSON.stringify({ "update": clientId.current }));
  }, [sendMessage]);

  const submitGuess = useCallback((guess) => {
    const guessRequest = { clientId: clientId.current, guess: guess };
    sendMessage(JSON.stringify(guessRequest));
  }, [sendMessage]);

  const chat = useCallback((message) => {
    const chatRequest = { clientId: clientId.current, message: message };
    sendMessage(JSON.stringify(chatRequest));
  }, [sendMessage]);

  useEffect(() => {
    if (lastMessage == null) {
        return;
    }
    const message = JSON.parse(lastMessage.data);

    if (message.hint != null) {
      setHint(message.hint);
    }

    if (message.countries != null) {
      setCountries(message.countries);
    }

    if (message.page != null) { 
      setPage(message.page);
    }

    if (message.standings != null) {
      setStandings(message.standings);
    }

    if (message.chat != null) {
      setLastChat(message.chat);
    }

    if (message.results != null) {
      setLastResults(message.results);
    }

    if (message.answer != null) {
      setLastAnswer(message.answer);
    }

    if (message.round != null) {
      setRound(message.round);
    }

    if (message.room != null) {
      setRoom(message.room);
    }

  }, [lastMessage,
      setHint,
      setCountries,
      setPage,
      setStandings,
      setLastChat,
      setLastResults,
      setLastAnswer,
      setRound,
      setRoom,
      startGame,
    ]);

  return {
    requestState,
    submitGuess,
    joinRoom,
    room,
    startGame,
    page,
    hint,
    countries,
    standings,
    lastChat,
    readChat,
    getOtherResults,
    getYourResult,
    chat,
    lastAnswer,
    lastResults,
    round,
  }
}

export default useGameClient;