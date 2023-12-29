import { useEffect, useState, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';

import { GameClientContext } from './GameClientContext';

function Chat() {

  const [message, setMessage] = useState("");

  const { chat, lastChat, readChat } = useContext(GameClientContext);

  useEffect(() => {
    if (lastChat !== null) {
      const message = readChat();
      toast(<span><b>{`${message.name}: `}</b>{message.message}</span>);
    }
  }, [lastChat, readChat]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (message) {
      chat(message);
      event.target.reset();
      setMessage("");
    }
  }

  return (
    <div className="Chat">
      <form onSubmit={handleSubmit}>
        <label>
          <input type="text" className="ChatBox" onChange={(e) => setMessage(e.target.value)}/>
        </label>
        <label>
          <input className="SubmitButton" type="submit" value="Chat"/>
        </label>
      </form>
      <ToastContainer 
        progressClassName="ToastProgress"
      />
    </div>
  )

}

export default Chat;