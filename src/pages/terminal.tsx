import React, { useState, useRef, useEffect } from 'react';
import './terminal.css'
import { COMMAND_DICTIONARY } from './terminalcommands';

export default function Terminal() {
  const [display, setDisplay] = useState<string>(COMMAND_DICTIONARY["system"]);
  const [inputHistory, setInputHistory] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e: React.ChangeEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim().toLowerCase();
    if (!trimmedInput) return;

    setInputHistory(prev => [...prev, input]);

    let response = '';
    if (trimmedInput === 'clear') {
      setDisplay("");
      setInput('');
      setInputHistory([]);
      return;
    }else {
    const fetchedResponse = COMMAND_DICTIONARY[trimmedInput];

    if (fetchedResponse) {
      response = fetchedResponse;
    } else {
      response = `Command not found: "${trimmedInput}". Type "help" for a list of commands.`;
    }
  }

    setDisplay(response);
    setInput('');
  };

return (
<div className="terminal-container">
  
  <div className="terminal-main-area">
    {/*DISPLAY */}
    <div className="terminal-display">
      {display}
      <div ref={terminalEndRef} />
    </div>

    <div className="terminal-user-info">
      {/*MIEJSCE NA USER INFO */}
      USER INFO
    </div>
  </div>

  <div className="terminal-bottom-area">
    
    {/*HISTORIA INPUTÓW*/}
    <div className="terminal-input-history">
      {inputHistory.map((cmd, i) => (
        <div key={i} className="history-item">
          <span>$ </span>{cmd}
        </div>
      ))}
    </div>

    {/*OBECNIE WPISYWANY TEKST*/}
    <form onSubmit={handleCommand} className="terminal-input-form">
      <span className="terminal-prompt">$</span>
      <input 
        type="text" 
        value={input} 
        onChange={(e) => setInput(e.target.value)} 
        className="terminal-text"
        autoFocus 
      />
    </form>

  </div>

</div>
);
}
