import React, { useState, useRef, useEffect } from 'react';
import './terminal.css'
import { COMMAND_DICTIONARY} from './terminalcommands';
import { TerminalUser } from './terminaluser';
import { Folder,Folders, FileText, User, Lock, FolderLock } from 'lucide-react';
import { type CommandContext } from './terminalcommands';
import { PasswordCrackerConsole } from './passwordcrackerconsole';
import { VIRTUAL_ROOT } from './terminalfile';
import rickRollVideo from '../rickroll/rick_roll.mp4';

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
  //historia
  const [inputHistory, setInputHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  //autofill tab
  const [tabMatches, setTabMatches] = useState<string[]>([]);
  const [tabMatchIndex, setTabMatchIndex] = useState<number>(-1); 

  const [input, setInput] = useState('');
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const [currentUser, setCurrentUser] = useState<TerminalUser | null>(null);
  const [isSystemLocked, setIsSystemLocked] = useState<boolean>(true);
  const [unlockedUsers, setUnlockedUsers] = useState<string[]>([]);
  const [activeApp, setActiveApp] = useState<string | null>(null);
  //rick roll
  const [showRickRoll, setShowRickRoll] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const triggerGlobalRickRoll = () => {
    // 2 sekundy opóźnienia
    setTimeout(() => {
      setShowRickRoll(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().catch(err => console.log("Autoplay blocked:", err));
        }
      }, 100);
    }, 2000);
  };

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e: React.ChangeEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    setInputHistory(prev => [...prev, input]);

    //reset history
    setHistoryIndex(-1);

    //reset autofill
    setTabMatches([]);
    setTabMatchIndex(-1);

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
if (isSystemLocked && commandName !== 'newuser' && commandName !== 'login' && commandName !=='help') {
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


const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  // 1. HISTORIA: STRZAŁKA W GÓRĘ
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (inputHistory.length === 0) return;

    let nextIndex = historyIndex + 1;
    if (nextIndex >= inputHistory.length) {
      nextIndex = inputHistory.length - 1;
    }
    setHistoryIndex(nextIndex);
    setInput(inputHistory[inputHistory.length - 1 - nextIndex]);
  }

  // 2. HISTORIA: STRZAŁKA W DÓŁ
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    let nextIndex = historyIndex - 1;

    if (nextIndex < 0) {
      setHistoryIndex(-1);
      setInput('');
    } else {
      setHistoryIndex(nextIndex);
      setInput(inputHistory[inputHistory.length - 1 - nextIndex]);
    }
  }

  // 3. AUTOUPUŁNIANIE: TAB
  if (e.key === 'Tab') {
    e.preventDefault();

  // 1. JEŚLI TO KOLEJNE KLIKNIĘCIE TABA (Rotacja istniejących dopasowań)
  if (tabMatches.length > 0) {
    const nextIndex = (tabMatchIndex + 1) % tabMatches.length;
    setTabMatchIndex(nextIndex);
    
    const currentMatch = tabMatches[nextIndex];
    
    // Sprawdzamy czy użytkownik uzupełniał argument (była spacja), czy komendę
    if (input.includes(' ')) {
      const parts = input.split(' ');
      const commandPart = parts[0]; // zostawiamy samą komendę np. "cat"
      setInput(`${commandPart} ${currentMatch}`);
    } else {
      // Uzupełniamy samą komendę
      setInput(currentMatch);
    }
    return;
  }

  // 2. JEŚLI TO PIERWSZE KLIKNIĘCIE TABA (Generowanie nowej listy dopasowań)
  const availableCommands = Object.keys(COMMAND_DICTIONARY).sort();

  // Scenariusz A: Pusty input -> rotujemy wszystkie komendy alfabetycznie
  if (!input) {
    if (availableCommands.length > 0) {
      setTabMatches(availableCommands);
      setTabMatchIndex(0);
      setInput(availableCommands[0]);
    }
    return;
  }

  // Scenariusz B: Wpisany tekst zawiera spację -> Uzupełniamy ARGUMENTY (pliki)
  if (input.includes(' ')) {
    const parts = input.split(' ');
    const commandPart = parts[0].toLowerCase();
    const argumentPart = parts.slice(1).join(' ').toLowerCase();

    // Autouzupełnianie plików tylko dla komendy "cat"
    if (commandPart === 'cat') {
      let allPaths: string[] = [];
      VIRTUAL_ROOT.files.forEach(f => allPaths.push(f.name));
      VIRTUAL_ROOT.subDirectories.forEach(dir => {
        dir.files.forEach(f => allPaths.push(`${dir.name}/${f.name}`));
      });
      allPaths.sort();

      const matches = allPaths.filter(p => p.toLowerCase().startsWith(argumentPart));
      if (matches.length > 0) {
        setTabMatches(matches);
        setTabMatchIndex(0);
        setInput(`${parts[0]} ${matches[0]}`);
      }
    }
  } 
  // Scenariusz C: Tekst NIE zawiera spacji -> Uzupełniamy/Rotujemy wyłącznie KOMENDY
  else {
    const partialCmd = input.toLowerCase();
    const matches = availableCommands.filter(cmd => cmd.startsWith(partialCmd));
    
    if (matches.length > 0) {
      setTabMatches(matches);
      setTabMatchIndex(0);
      setInput(matches[0]);
    }
  }
}
};

return (
<>

  {showRickRoll && (
            <div style={{
              position: 'relative',
              width: '100%', 
              height: '100%',
              backgroundColor: '#000', 
              zIndex: 99, 
              display: 'flex',
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              padding: '10px',
              boxSizing: 'border-box'
            }}>
              <video 
                ref={videoRef}
                src={rickRollVideo} 
                style={{ width: '100%', height: 'calc(100% - 40px)', objectFit: 'contain' }}
                controls
              />
              <button 
                onClick={() => {
                  if (videoRef.current) videoRef.current.pause();
                  setShowRickRoll(false);
                }}
                style={{
                  marginTop: '5px', background: '#000', color: '#ff3333',
                  border: '1px solid #ff3333', padding: '3px 10px', fontFamily: 'monospace', cursor: 'pointer'
                }}
              >
                [ CLOSE OVERLAY ]
              </button>
            </div>
          )}
{!showRickRoll && (
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
      onRickRoll={triggerGlobalRickRoll}
    />
  )}
  </div>
    {/*USER INFO*/}
    <div className="terminal-user-info">
      {/*USER ICON*/}
      <User size={160} color="#96ADFF" style={{ marginRight: '6px', display: 'inline-block' }} />
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
        onChange={(e) => {
          setInput(e.target.value)
          //autofill
          setTabMatches([]);
          setTabMatchIndex(-1);
        }}
        onKeyDown={handleKeyDown}
        className="terminal-text"
        autoFocus 
      />
    </form>

  </div>

</div>
)}
</>
);
}
