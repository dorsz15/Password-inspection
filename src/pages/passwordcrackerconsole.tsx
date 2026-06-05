import React, { useState, useEffect, useRef } from 'react';
import { SYSTEM_USERS } from './terminaluser';
import { VIRTUAL_ROOT } from './terminalfile';

interface CrackerProps {
  currentUser: any;
  onClose: () => void;
  onRickRoll: () => void;
}

export const PasswordCrackerConsole: React.FC<CrackerProps> = ({ currentUser, onClose, onRickRoll }) => {
    type PluginType = 'Goliath' | 'Cambridge' | 'TasteTheRainbow';
    const [activePlugin, setActivePlugin] = useState<PluginType>('Goliath');
  const [progress, setProgress] = useState(0);
  const [target, setTarget] = useState('PLACEHOLDER');
  const [log, setLog] = useState<string[]>(['[SYS] Initializing brute-force modules...']);
  const [resetTrigger, setResetTrigger] = useState(0);

  //brute force attack
  const comboIndexRef = useRef(0);

    const currentUsername = currentUser.username;
    const userFolder = VIRTUAL_ROOT.subDirectories.find(
    dir => dir.name.toLowerCase() === currentUsername);

    const hasCambridge = userFolder?.files.some(f => f.name.toLowerCase() === 'cambridge.exe') || false;
    const hasRainbow = userFolder?.files.some(f => f.name.toLowerCase() === 'tastetherainbow.exe') || false;

    //hash for rainbow
    const computeSHA256 = async (message: string): Promise<string> => {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };


  //rick roll
  const checkAndTriggerRickRoll = (crackedPassword: string) => {
  if (crackedPassword.toLowerCase() === 'ab') {
    onRickRoll(); // <-- WYWOŁAJ FUNKCJĘ Z PROPSÓW
  }
};

  useEffect(() => {
 comboIndexRef.current = 0;
  setProgress(0);

  const realPassword = SYSTEM_USERS[target]?.['password'] || 'UNKNOWN';

  // 1. MINI ROCKYOU.TXT DATABASE
  const dictionaryDb = [
    '123456', '123456789', '111111', '12345678', '12345', '1234567', '123123', '000000', '7777777',
    'password', 'qwerty', 'querty', 'drowssap', 'secret', 'password123', 'admin', 'admin1', 'login',
    'iloveyou', 'princess', 'monkey', 'forever', 'superman', 'shadow', 'dracula', 'michael', 'jessica',
    'charlie', 'harley', 'football', 'soccer', 'pokemon', 'matrix', 'hunter2', 'welcome', 'letmein',
    'polska', 'haslo123', 'dupa123', 'kochamcie', 'marcin', 'kasia', 'buziaki',
    '2000', '1999', '1998', '2026', '2025', '2024',
    ...Object.values(SYSTEM_USERS).map((u: any) => u.password)
  ];
  
  // Oczyszczanie z duplikatów
  const uniqueDictionary = Array.from(new Set(dictionaryDb));
  
  // Pełny zestaw znaków
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[{]};:'\",.<>/?\\|`~";
  const base = charset.length;

  // Funkcja generująca kombinację dla podanego indeksu
  const getCombination = (num: number): string => {
    let result = "";
    let n = num;
    while (n >= 0) {
      result = charset[n % base] + result;
      n = Math.floor(n / base) - 1;
    }
    return result;
  };

  // Matematyczne obliczenie dokładnego indeksu, na którym znajduje się hasło
  const getTargetPasswordIndex = (password: string): number => {
    let totalIndex = 0;
    
    // 1. Dodaj kombinacje dla wszystkich krótszych długości haseł
    for (let len = 1; len < password.length; len++) {
      totalIndex += Math.pow(base, len);
    }
    
    // 2. Dodaj pozycję hasła w obrębie aktualnej długości
    let currentLengthIndex = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password[i];
      const charValue = charset.indexOf(char);
      currentLengthIndex = currentLengthIndex * base + charValue;
    }
    
    return totalIndex + currentLengthIndex;
  };

  // Wyliczamy łączną liczbę prób potrzebną do złamania tego hasła
  const totalAttemptsRequired = realPassword !== 'UNKNOWN' ? getTargetPasswordIndex(realPassword) : 0;

  const interval = setInterval(() => {
    const runAttackStep = async () => {
      // ==========================================
      // 1. PRAWDZIWY BRUTE-FORCE (GOLIATH)
      // ==========================================
      if (activePlugin === 'Goliath') {
        if (realPassword === 'UNKNOWN') {
          setLog(prev => [...prev, "[ERROR] Target password undefined."]);
          return false;
        }

        const currentAttempt = getCombination(comboIndexRef.current);
        setLog(prev => [...prev, `[GOLIATH] Testing: "${currentAttempt}"`]);

        if (totalAttemptsRequired > 0) {
          // Jeśli liczba kombinacji jest ogromna, symulujemy postęp na podstawie długości hasła, 
          // albo po prostu sztucznie podbijamy pasek, żeby "żył" (np. rósł o 1% co 50 prób)
          const simulatedProgress = totalAttemptsRequired > 10000 
            ? Math.floor((comboIndexRef.current / 50)) // Dla trudnych haseł pasek rośnie co 50 prób
            : Math.floor((comboIndexRef.current / totalAttemptsRequired) * 100);
            
          setProgress(Math.min(simulatedProgress, 99));
        }

        if (currentAttempt === realPassword) {
          setProgress(100);
          setLog(prev => [
            ...prev, 
            `[SUCCESS] GOLIATH cracked the password after ${comboIndexRef.current + 1} attempts!`,
            `[SYS] Key found: "${currentAttempt}"`
          ]);
          checkAndTriggerRickRoll(currentAttempt); // <--- ODPAŁ RICKA
          return false;
        }
        comboIndexRef.current++;
      } 
      
      // ==========================================
      // 2. PRAWDZIWY ATAK SŁOWNIKOWY (CAMBRIDGE)
      // ==========================================
      else if (activePlugin === 'Cambridge') {
        const currentIndex = comboIndexRef.current;

        if (currentIndex >= uniqueDictionary.length) {
          setProgress(0);
          setLog(prev => [
            ...prev, 
            `[ERROR] DICTIONARY ATTACK FAILED!`,
            `[SYS] Password not found in local rockyou.bin chunk.`
          ]);
          return false;
        }

        const currentWord = uniqueDictionary[currentIndex];
        setLog(prev => [...prev, `[CAMBRIDGE] rockyou.bin -> Testing word: "${currentWord}"`]);

        const trueProgress = Math.floor((currentIndex / uniqueDictionary.length) * 100);
        setProgress(Math.min(trueProgress, 99));

        if (currentWord === realPassword) {
          setProgress(100);
          setLog(prev => [
            ...prev, 
            `[SUCCESS] CAMBRIDGE successfully parsed rockyou.bin database!`,
            `[SYS] Key found: "${currentWord}"`
          ]);
          checkAndTriggerRickRoll(currentWord); // <--- ODPAŁ RICKA
          return false;
        }
        comboIndexRef.current++;
      }
      
      // ==========================================
      // 3. PRAWDZIWY ATAK TĘCZOWY (TASTE THE RAINBOW)
      // ==========================================
      else if (activePlugin === 'TasteTheRainbow') {
        const currentIndex = comboIndexRef.current;

        if (currentIndex >= uniqueDictionary.length) {
          setProgress(0);
          setLog(prev => [
            ...prev,
            `[ERROR] RAINBOW TABLE LOOKUP FAILED!`
          ]);
          return false;
        }

        const dictionaryWord = uniqueDictionary[currentIndex];
        const computedRainbowHash = await computeSHA256(dictionaryWord);
        const targetHash = await computeSHA256(realPassword);

        const shortRainbowHash = computedRainbowHash.substring(0, 16) + '...';

        setLog(prev => [
          ...prev, 
          `[RAINBOW] Lookup [Index: ${currentIndex}] | Dict: "${dictionaryWord}" -> Hash: [${shortRainbowHash}]`
        ]);

        const trueProgress = Math.floor((currentIndex / uniqueDictionary.length) * 100);
        setProgress(Math.min(trueProgress, 99));

        if (computedRainbowHash === targetHash) {
          setProgress(100);
          setLog(prev => [
            ...prev,
            `[SUCCESS] TASTE THE RAINBOW matched precomputed SHA-256 collision!`,
            `[SYS] Decrypted plain text key via Rainbow: "${dictionaryWord}"`
          ]);
          checkAndTriggerRickRoll(dictionaryWord); // <--- ODPAŁ RICKA
          return false;
        }
        comboIndexRef.current++;
      }

      return true;
    };

    // Uruchomienie asynchronicznej logiki i ewentualne czyszczenie interwału
    runAttackStep().then(shouldContinue => {
      if (!shouldContinue) {
        clearInterval(interval);
      }
    });
  }, 40);

    return () => clearInterval(interval);
  }, [target, activePlugin, resetTrigger]);

  const handleRestart = () => {
    comboIndexRef.current = 0;
    setProgress(0);
    setLog([`[SYS] Restarting ${activePlugin} attack module for target ${target.toUpperCase()}...`]);
    setResetTrigger(prev => prev + 1);
  };

return (
  <>
  {/* ZMODYFIKOWANY OVERLAY RICKA - WPASOWANY W TERMINAL */}
    
  <div className="cracker-app-container" style={{ fontFamily: 'monospace', color: '#00ff00', padding: '10px' }}>
    {/* Górna belka aplikacji */}
    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #00ff00', paddingBottom: '5px' }}>
      <span>PASSWORD_CRACKER_v1.0.exe</span>
      <div style={{ display: 'flex', gap: '15px' }}>
      {/* PRZYCISK RESTARTU */}
      <button onClick={handleRestart} style={{ background: 'transparent', color: '#00ffff', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
        [ RESTART ATTACK ]
      </button>
      <button onClick={onClose} style={{ background: 'transparent', color: '#ff3333', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
        [ CLOSE ]
      </button>
  </div>
    </div>

    {/* Panel konfiguracji celu */}
    <div style={{ marginTop: '15px', display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
      <div>
        LOGGED OPERATOR: <span style={{ color: '#00ff00', fontWeight: 'bold' }}>{currentUser.username.toUpperCase()}</span>
      </div>
      
      <div>
        <label htmlFor="target-select">TARGET PROFILE: </label>
        <select 
          id="target-select"
          value={target} 
          onChange={(e) => {
            setTarget(e.target.value);
            setProgress(0);
            setLog([`[SYS] Target changed to ${e.target.value.toUpperCase()}. Ready for injection.`]);
          }}
          style={{ background: '#000', color: '#00ff00', border: '1px solid #00ff00', fontFamily: 'monospace', cursor: 'pointer' }}
        >
          {Object.keys(SYSTEM_USERS).map(user => (
            <option 
              key={user} 
              value={user} 
              disabled={user.toLowerCase() === currentUser.username.toLowerCase()} // <-- BLOKADA WYBORU
            >
              {user.toUpperCase()} {user.toLowerCase() === currentUser.username.toLowerCase() ? '(YOU)' : ''}
            </option>
          ))}
        </select>
      </div>
    </div>

    {/*SEKCJA PLUGINÓW*/}
    <div style={{ marginTop: '15px' }}>
      <div style={{ color: '#00ffff', marginBottom: '8px' }}>[ AVAILABLE PLUGINS ]</div>
<div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
  
  {/* PLUGIN 1: GOLIATH (Domyślnie zawsze odblokowany) */}
  <button 
    onClick={() => {
      setActivePlugin('Goliath');
      setProgress(0);
      setLog(['[GOLIATH] Initializing Heavy Brute-Force Module...']);
    }}
    style={{
      flex: 1, padding: '5px', fontFamily: 'monospace', cursor: 'pointer',
      background: activePlugin === 'Goliath' ? '#003300' : '#000',
      color: activePlugin === 'Goliath' ? '#00ff00' : '#00aa00',
      border: activePlugin === 'Goliath' ? '1px solid #00ff00' : '1px solid #004400',
    }}
  >
    {activePlugin === 'Goliath' ? '🟢 GOLIATH (Active)' : '⚪ GOLIATH [BruteForce]'}
  </button>

  {/* PLUGIN 2: CAMBRIDGE */}
  <button 
    onClick={() => {
      if (hasCambridge) {
        setActivePlugin('Cambridge');
        setProgress(0);
        setLog(['[CAMBRIDGE] Loading Global Dictionary Words Database...']);
      } else {
        setProgress(0);
        setLog([
          `[ ACCESS DENIED ] Plugin "Cambridge" is not installed.`,
          `--------------------------------------------------`,
          `To upgrade your cracker module, exit to the main terminal [ESC] and type:`,
          `> install Cambridge`
        ]);
      }
    }}
    style={{
      flex: 1, padding: '5px', fontFamily: 'monospace', cursor: 'pointer',
      background: activePlugin === 'Cambridge' ? '#003300' : '#000',
      color: !hasCambridge ? '#666' : (activePlugin === 'Cambridge' ? '#00ff00' : '#00aa00'),
      border: !hasCambridge ? '1px dashed #333' : (activePlugin === 'Cambridge' ? '1px solid #00ff00' : '1px solid #004400'),
    }}
  >
    {activePlugin === 'Cambridge' ? '🟢 CAMBRIDGE (Active)' : (!hasCambridge ? '🔒 CAMBRIDGE [Locked]' : '⚪ CAMBRIDGE [Dictionary]')}
  </button>

  {/* PLUGIN 3: TASTE THE RAINBOW */}
  <button 
    onClick={() => {
      if (hasRainbow) {
        setActivePlugin('TasteTheRainbow');
        setProgress(0);
        setLog(['[RAINBOW] Mounting Cryptographic Precomputed Rainbow Tables...']);
      } else {
        setProgress(0);
        setLog([
          `[ ACCESS DENIED ] Plugin "TasteTheRainbow" is not installed.`,
          `--------------------------------------------------`,
          `To upgrade your cracker module, exit to the main terminal [ESC] and type:`,
          `> install TasteTheRainbow`
        ]);
      }
    }}
    style={{
      flex: 1, padding: '5px', fontFamily: 'monospace', cursor: 'pointer',
      background: activePlugin === 'TasteTheRainbow' ? '#003300' : '#000',
      color: !hasRainbow ? '#666' : (activePlugin === 'TasteTheRainbow' ? '#00ff00' : '#00aa00'),
      border: !hasRainbow ? '1px dashed #333' : (activePlugin === 'TasteTheRainbow' ? '1px solid #00ff00' : '1px solid #004400'),
    }}
  >
    {activePlugin === 'TasteTheRainbow' ? '🟢 TASTE THE RAINBOW (Active)' : (!hasRainbow ? '🔒 TASTE THE RAINBOW [Locked]' : '⚪ TASTE THE RAINBOW [Rainbow]')}
  </button>

</div>
    </div>

    {/* Pasek postępu operacji */}
    <div style={{ margin: '15px 0 5px 0' }}>
      EXECUTION PROGRESS: [ {['#'.repeat(progress / 4), '.'.repeat(25 - progress / 4)]} ] {progress}%
    </div>

    {/* Konsola logów*/}
    <div className="cracker-logs-window">
      {log.map((line, idx) => <div key={idx}>{line}</div>)}
    </div>

  </div>
  </>
);
};