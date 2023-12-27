import { useEffect, useState, useContext, useCallback } from 'react';
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { TypeAnimation } from 'react-type-animation';

import './Guess.css';
import Standings from './Standings';
import { GameClientContext } from './GameClientContext';

function Guess() {

  const [guess, setGuess] = useState("");
  
  const { hint, submitGuess, countries, page } = useContext(GameClientContext);

  const [countryOptions, setCountryOptions] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (page !== "") {
      navigate(`/${page}`);
    }
  }, [page, navigate]);

  useEffect(() => {
    const options = countries.map(c => ({ value: c.id, label: c.name }));
    setCountryOptions(options);
  }, [countries]);

  const typing = useCallback(() => {
        return (<TypeAnimation
          sequence={[hint]}
          speed={60}
          cursor={true}
          style={{whiteSpace: 'pre-line'}}
        />)
  }, [hint]);

  const handleSubmit = (event) => {
    event.preventDefault();
    submitGuess(guess);
  }

  return (
    <div className="Guess">
      <h1>Round 1</h1>
      <div className="Hint" style={{ textAlign: 'left'}}>
        {hint && typing()}
      </div>
      <form onSubmit={handleSubmit}>
        <label>
          <Select isSearchable={true} options={countryOptions} onChange={choice => setGuess(choice.value)}></Select>
          <input className="SubmitButton" type="submit" value="Guess"/>
        </label>
      </form>
      <Standings />
    </div>
  );
}

export default Guess;
