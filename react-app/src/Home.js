import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate("/guess");

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("REGISTERING...");
    navigate("/guess");
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text"></input>
      </label>
      <input type="submit" value="Join"/>
    </form>
  );
}

export default Home;
