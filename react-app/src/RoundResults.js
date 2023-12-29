import 'react-toastify/dist/ReactToastify.css';
import 'leaflet/dist/leaflet.css'
import L from 'leaflet';
import { useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { TypeAnimation } from 'react-type-animation';
import { MapContainer, TileLayer, Marker } from 'react-leaflet'

import { GameClientContext } from './GameClientContext';
import Chat from './Chat';

function RoundResults() {
  const { getYourResult, getOtherResults, lastResults, lastAnswer, page } = useContext(GameClientContext);

  const navigate = useNavigate();

  const smallIcon = L.icon({
    iconUrl: "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|e85141&chf=a,s,ee00FFFF",
    iconAnchor: [20, 34],
  });

  const answerIcon = L.icon({
    iconUrl: "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|2ecc71&chf=a,s,ee00FFFF",
    iconAnchor: [20, 34],
  });

  useEffect(() => {
    if (page !== "") {
      navigate(`/${page}`);
    }
  }, [navigate, page]);

  const countdown = ['fifteen', 'fourteen', 'thirteen', 'twelve', 'eleven', 'ten', 'nine', 'eight', 'seven', 'six', 'five', 'four', 'three', 'two', 'one'];
  const sequence = [];

  countdown.forEach((i) => {
    sequence.push(`Next round in... ${i}`);
    sequence.push(1000);
  });

  const result = getYourResult();

  const bounds = Object.keys(lastResults).map((k) => [lastResults[k].lat, lastResults[k].long]).concat([[lastAnswer.lat, lastAnswer.long]]);
  return (
    <div className="Results">
      <h2>The answer was: {lastAnswer.name}</h2>
      { result && <h4>You guessed: <strong>{result.guess}</strong> for a score of <strong>{result.score}</strong></h4> }

      {getOtherResults().map(r => {
        return <p>{r.name} guessed: {r.guess} for a score of {r.score}</p>
      })}
      <Chat />
      <MapContainer 
        scrollWheelZoom={false}
        bounds={bounds}
        style={{ height:"30em",marginTop:"0.5em", marginBottom:'0.5em' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {Object.keys(lastResults).map((k) => {
          return (
            <Marker icon={smallIcon} position={[lastResults[k].lat, lastResults[k].long]} />
          )
        })}
        <Marker className="AnswerMarker" icon={answerIcon} position={[lastAnswer.lat, lastAnswer.long]} />
      </MapContainer>
      <h4>
        <TypeAnimation
          sequence={sequence}
          preRenderFirstString={true}
          speed={80}
          cursor={true}
        />
      </h4>
    </div>
  );
}

export default RoundResults;