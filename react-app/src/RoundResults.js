import 'react-toastify/dist/ReactToastify.css';
import 'leaflet/dist/leaflet.css'
import { ToastContainer, toast } from 'react-toastify';
import L, { marker } from 'leaflet';
import { useEffect, useState, useContext, createRef } from 'react';
import { useNavigate } from "react-router-dom";
import { TypeAnimation } from 'react-type-animation';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'

import { GameClientContext } from './GameClientContext';

function RoundResults() {
  const { getYourResult, getOtherResults, lastResults, lastAnswer, chat, lastChat, readChat, page } = useContext(GameClientContext);

  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const ref = createRef();

  // if (ref?.current) {
  //   ref.current._icon.style.filter = "hue-rotate(120deg)";
  // }

  // L.Marker.prototype.setIcon(L.icon({
  //   iconUrl: marker
  // }))


  const smallIcon = L.icon({
    iconUrl: "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|e85141&chf=a,s,ee00FFFF",
    iconAnchor: [15, 47],
  });

  const answerIcon = L.icon({
    iconUrl: "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|2ecc71&chf=a,s,ee00FFFF",
    iconAnchor: [15, 47],
  });

  useEffect(() => {
    if (page === "") {
        return;
    }
    navigate(`/${page}`);
  }, [navigate, page]);

  const countdown = ['ten', 'nine', 'eight', 'seven', 'six', 'five', 'four', 'three', 'two', 'one'];
  const sequence = [];

  countdown.forEach((i) => {
    sequence.push(`Next round in... ${i}`);
    sequence.push(1000);
  });

  useEffect(() => {
    if (lastChat !== null) {
      const message = readChat();
      toast(<span><b>{`${message.name}: `}</b>{message.message}</span>);
    }
  }, [lastChat, readChat]);

  const handleSubmit = (event) => {
    event.preventDefault();
    chat(message);
    event.target.reset();
    setMessage("");
  }

  const result = getYourResult();

  const bounds = Object.keys(lastResults).map((k) => [lastResults[k].lat, lastResults[k].long]).concat([[lastAnswer.lat, lastAnswer.long]]);
  console.log(bounds);
  return (
    <div className="Results">
      <h2>The answer was: {lastAnswer.name}</h2>
      <h4>You guessed: <strong>{result.guess}</strong> for a score of <strong>{result.score}</strong></h4>

      {getOtherResults().map(r => {
        return <p>{r.name} guessed: {r.guess} for a score of {r.score}</p>
      })}
      <div className="Chat">
        <form onSubmit={handleSubmit}>
          <label>
            <input type="text" className="ChatBox" onChange={(e) => setMessage(e.target.value)}/>
          </label>
          <label>
            <input className="SubmitButton" type="submit" value="Chat"/>
          </label>
        </form>
      </div>
      <MapContainer 
        center={[51.505, -0.09]}
        scrollWheelZoom={false}
        // zoom={2}
        bounds={bounds}
        style={{ height:"30em",marginTop:"0.5em", marginBottom:'0.5em' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {Object.keys(lastResults).map((k) => {
          return (
            <Marker icon={smallIcon} position={[lastResults[k].lat, lastResults[k].long]}>
              <Popup>
                {result.name}
              </Popup>
            </Marker>)
        })}
        <Marker className="AnswerMarker" ref={ref} icon={answerIcon} position={[lastAnswer.lat, lastAnswer.long]}>
          <Popup>
            {result.name}
          </Popup>
        </Marker>
      </MapContainer>
      <h4>
        <TypeAnimation
          sequence={sequence}
          preRenderFirstString={true}
          speed={80}
          cursor={true}
        />
      </h4>
      <ToastContainer 
        progressClassName="ToastProgress"
      />
    </div>
  );
}

export default RoundResults;