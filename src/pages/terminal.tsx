import React, { useState, useRef, useEffect } from 'react';
import './terminal.css'
import { COMMAND_DICTIONARY} from './terminalcommands';
import { TerminalUser } from './terminaluser';
import { Folder,Folders, FileText, User, Lock, FolderLock } from 'lucide-react';
import { type CommandContext } from './terminalcommands';
import { PasswordCrackerConsole } from './passwordcrackerconsole';

// Uniwersalny kreator linijek z ikonami
const createTreeLine = (line: string, tag: string, icon: React.ReactNode, index: number) => {
  const parts = line.split(tag);
  return (
    <div key={index} className="terminal-tree-line" style={{ display: 'flex', alignItems: 'center' }}>
      <span>{parts[0]}</span> {/* Kreski rysujące drzewo */}
      {icon}                  {/* ikona Lucide */}
      <span>{parts[1]}</span> {/* Nazwa pliku lub folderu */}
    </div>
  );
};

export default function Terminal() {

  const parseDisplayToStringWithIcons = (fullText: string) => {
  const lines = fullText.split('\n');

  return lines.map((line, index) => {
    
    if (line.includes('[FOLDER]') && unlockedUsers.some(user => line.includes(user))) {
      return createTreeLine(
        line, 
        '[FOLDER]', 
        <Folder size={16} color="#00ff00" style={{ marginRight: '6px', display: 'inline-block' }} />, 
        index
      );
    }
    if (line.includes('[FOLDER]')) {
  return createTreeLine(
    line, 
    '[FOLDER]', 
    <FolderLock size={16} color="#ff5555" style={{ marginRight: '6px', display: 'inline-block' }} />, 
    index
  );
}
    if (line.includes('[FILE]')) {
      return createTreeLine(
        line, 
        '[FILE]', 
        <FileText size={16} color="#00aa00" style={{ marginRight: '6px', display: 'inline-block' }} />, 
        index
      );
    }
    if (line.includes('[FOLDERS]')) {
      return createTreeLine(
        line, 
        '[FOLDERS]', 
        <Folders size={16} color="#00aa00" style={{ marginRight: '6px', display: 'inline-block' }} />, 
        index
      );
    }
    if (line.includes('[UNLOCKED]')) {
      return createTreeLine(
        line, 
        '[UNLOCKED]', 
        <Lock size={16} color="#00aa00" style={{ marginRight: '6px', display: 'inline-block' }} />, 
        index
      );
    }
    if (line.includes('[LOCKED]')) {
      return createTreeLine(
        line, 
        '[LOCKED]', 
        <Lock size={16} color="#aa0000" style={{ marginRight: '6px', display: 'inline-block' }} />, 
        index
      );
    }
    return <div key={index}>{line === '' ? '\u00A0' : line}</div>;
  });
};

  const [display, setDisplay] = useState<string>(
  `[ CYBER_FROG OS - RESTRICTED ACCESS ]\n` +
  `System is currently LOCKED.\n\n` +
  `To begin, you must create an initial profile.\n` +
  `Usage: newuser [username] [password]\n` +
  `--------------------------------------------------`);
  const [inputHistory, setInputHistory] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const [currentUser, setCurrentUser] = useState<TerminalUser | null>(null);
  const [isSystemLocked, setIsSystemLocked] = useState<boolean>(true);
  const [unlockedUsers, setUnlockedUsers] = useState<string[]>([]);
  const [activeApp, setActiveApp] = useState<string | null>(null);
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e: React.ChangeEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    setInputHistory(prev => [...prev, input]);

    const [rawCommand, ...argsArray] = trimmedInput.split(' ');
    const commandName = rawCommand.toLowerCase();
    const argument = argsArray.join(' ');

    let response = '';
    if (trimmedInput === 'clear') {
      setDisplay("");
      setInput('');
      setInputHistory([]);
      return;
    }
const commandContext: CommandContext = {
  currentUser,
  setCurrentUser,
  isSystemLocked,
  setIsSystemLocked,
  unlockedUsers,
  setUnlockedUsers,
  setActiveApp
};

// 2. FILTR BLOKADY SYSTEMU SYSTEMOWEGO
// Jeśli system jest zablokowany, pozwalamy TYLKO na 'newuser' lub 'login'
if (isSystemLocked && commandName !== 'newuser' && commandName !== 'login') {
  response = `[ SECURITY ALERT ] System is locked. Authentication required.\nUse "newuser" to register or "login" to authenticate.`;
} 
else {
  const command = COMMAND_DICTIONARY[commandName];

  if (command) {
    response = command.execute(argument, commandContext);
  } else {
    response = `Command not found: "${commandName}".`;
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
  {activeApp === null && (
    /* STANDARDOWY WIDOK TERMINALA (Ściana tekstu) */
    <>
      {parseDisplayToStringWithIcons(display)}
      <div ref={terminalEndRef} />
    </>
  )}

  {activeApp === 'password_cracker' && (
    /*OSOBNY KONTENER REACTOWY DLA CRACKERA */
    <PasswordCrackerConsole 
      currentUser={currentUser} 
      onClose={() => setActiveApp(null)} // Funkcja powrotu do terminala
    />
  )}
  </div>
    {/*USER INFO*/}
    <div className="terminal-user-info">
      {/*USER ICON*/}
      <User size={160} color="#00aa00" style={{ marginRight: '6px', display: 'inline-block' }} />
      <div className="info-box-header">[ SESSION PROFILE ]</div>
      <div className="info-row">
        <span className="info-label">CURRENT USER:</span>
        <span className="info-value user-highlight">{currentUser?.username || 'NOT INITIALIZED'}</span>
      </div>

      <div className="info-row">
        <span className="info-label">PRIVILEGES:</span>
        <span className={`info-value auth-badge ${currentUser?.role || 'guest'}`}>
          [{currentUser?.role?.toUpperCase() || 'LOCKED'}]
        </span>
      </div>
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
