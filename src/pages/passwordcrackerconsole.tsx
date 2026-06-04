import React, { useState, useEffect } from 'react';
import { SYSTEM_USERS } from './terminaluser';
import { VIRTUAL_ROOT } from './terminalfile';

interface CrackerProps {
  currentUser: any;
  onClose: () => void;
}

export const PasswordCrackerConsole: React.FC<CrackerProps> = ({ currentUser, onClose }) => {
    type PluginType = 'Goliath' | 'Cambridge' | 'TasteTheRainbow';
    const [activePlugin, setActivePlugin] = useState<PluginType>('Goliath');
  const [progress, setProgress] = useState(0);
  const [target, setTarget] = useState('PLACEHOLDER');
  const [log, setLog] = useState<string[]>(['[SYS] Initializing brute-force modules...']);

    const currentUsername = currentUser.username;
    const userFolder = VIRTUAL_ROOT.subDirectories.find(
    dir => dir.name.toLowerCase() === currentUsername);

    const hasCambridge = userFolder?.files.some(f => f.name.toLowerCase() === 'cambridge.bin') || false;
    const hasRainbow = userFolder?.files.some(f => f.name.toLowerCase() === 'rainbow.bin') || false;

  useEffect(() => {
  const interval = setInterval(() => {
    setProgress((old) => {
      if (old >= 100) {
        clearInterval(interval);
        
        const realPassword = SYSTEM_USERS[target]?.['password'] || 'UNKNOWN';
        
        setLog(prev => [...prev, `[SUCCESS] ${activePlugin} successfully decrypted ${target.toUpperCase()}! Key: ${realPassword}`]);
        return 100;
      }
      
      // Dynamiczne generowanie logów w zależności od wybranego pluginu
      if (old % 20 === 0 && old > 0) {
        let currentLog = '';
        
        switch(activePlugin) {
          case 'Goliath': // Bruteforce - leci po kolei znak po znaku
            currentLog = `[GOLIATH] Brute-forcing char combinations: "${Math.random().toString(36).substring(2, 6)}..."`;
            break;
          case 'Cambridge': // Słownik - ładuje bazy słów
            const dictWords = ['password', 'admin1', 'qwerty', 'monkey', 'secret'];
            currentLog = `[CAMBRIDGE] Testing dictionary word chunk: "${dictWords[old/20 % dictWords.length]}"`;
            break;
          case 'TasteTheRainbow': // Rainbow Tables - porównuje gotowe skróty MD5/SHA256
            currentLog = `[RAINBOW] Comparing SHA-256 hash lookup table for sector_${old}...`;
            break;
        }
        
        setLog(prev => [...prev, currentLog]);
      }
      
      return old + 5;
    });
  }, 150);

  return () => clearInterval(interval);
}, [target, activePlugin]);

return (
  <div className="cracker-app-container" style={{ fontFamily: 'monospace', color: '#00ff00', padding: '10px' }}>
    
    {/* Górna belka aplikacji */}
    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #00ff00', paddingBottom: '5px' }}>
      <span>PASSWORD_CRACKER_v1.0.exe</span>
      <button onClick={onClose} style={{ background: 'transparent', color: '#ff3333', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
        [ ESC / CLOSE ]
      </button>
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
            <option key={user} value={user}>{user.toUpperCase()}</option>
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
);
};