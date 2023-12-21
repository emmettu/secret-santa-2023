function Players() {

  const players = ["Emmett", "Tully", "Evelyn"];

  return (
    <div className="Players">
      {players.map((playerName) => {
        return <div>
          { playerName }
        </div>
      })}
    </div>
  );
}

export default Players;
