import {useEffect, useState } from 'react'
import { zxcvbn, zxcvbnOptions} from '@zxcvbn-ts/core';
import type { ZxcvbnResult } from '@zxcvbn-ts/core';
import { translations } from '@zxcvbn-ts/language-en';
import { adjacencyGraphs, dictionary as commonDictionary } from '@zxcvbn-ts/language-common';
import { dictionary as plDictionary, translations as plTranslations } from '@zxcvbn-ts/language-pl';

import './PasswordAnalyzer.css'
import './../App.css';
import './ScoreMetrics'

import ScoreMetrics from './ScoreMetrics';
import {getRandomRoast} from './../AiRoaster'
import {checkPasswordPwned} from './../ChechForLeak'
import { Eye, EyeOff, X } from 'lucide-react';

zxcvbnOptions.setOptions({
  translations: translations,
  dictionary: {
    ...commonDictionary,
    ...plDictionary,
  },
  graphs: adjacencyGraphs,
});
interface AnalyzerProps {
  externalPassword: string;
  onPasswordChange: (value: string) => void;
}

export default function PasswordAnalyzer({ externalPassword, onPasswordChange }: AnalyzerProps) {
  const [strengthResult, setStrengthResult] = useState<ZxcvbnResult | null>(null)

  /*Sprawdzamy czy hasło zostało zleakowane za pomoca api Have I been pawned*/
  const [isPwned, setIsPwned] = useState<boolean | null>(null);

  const [roastMessage, setRoastMessage] = useState<string>('');



  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
// Funkcja, która uruchamia bibliotekę zxcvbn
  const runAnalysis = (text: string) => {
    if (text.length > 0) {
      const result = zxcvbn(text);
      setStrengthResult(result);
    } else {
      setStrengthResult(null);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value;
    onPasswordChange(newPassword);
    runAnalysis(newPassword);
  };
  const handleClearInput = () => {
    onPasswordChange('');
    setStrengthResult(null);
    setRoastMessage('');
  };
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  useEffect(() => {

  if (!externalPassword) {
    setRoastMessage('');
    setStrengthResult(null);
    setIsPwned(null);
    return;
  }
  
  const result = zxcvbn(externalPassword);
  setStrengthResult(result);
  checkPasswordPwned(externalPassword).then(setIsPwned);

  const newRoast = getRandomRoast(result.score);
  setRoastMessage(newRoast);

}, [externalPassword]);

  const score = strengthResult?.score ?? 0;
  //const timeToCrack = strengthResult?.crackTimesDisplay?.offlineFastHashing1e10PerSecond ?? '';
  const timeToCrackSlow = strengthResult?.crackTimesDisplay?.offlineSlowHashing1e4PerSecond ?? '';

  const getColorClass = (value: number) => {
      // Dla skali 0-10:
      if (value < 2) return 'fill-red';
      if (value < 4) return 'fill-pink';
      if (value < 6) return 'fill-indigo';
      if (value < 8) return 'fill-blue';
      return 'fill-cyan';
    };

  const handleFixPassword = () => {
      if (!externalPassword) return;

      const specialChars = "!@#$%^&*()_+";
      let improved = externalPassword
        .split('')
        .map(char => Math.random() > 0.5 ? char.toUpperCase() : char)
        .join('');
      
      improved += specialChars[Math.floor(Math.random() * specialChars.length)];
      improved += Math.floor(Math.random() * 10); // dodaje cyfrę

      onPasswordChange(improved);
      runAnalysis(improved); 
    };

  

return (
    <>
      <section className="analyzer-card">
        <div >
          <h2 className="analyzer-subtitle">CHECK THE <span className='analyzer-strong'>STRENGTH</span> OF YOUR</h2>
          <h1 className="analyzer-title">PASSWORD</h1>
          <h2 >{roastMessage}</h2>
        </div>
      <div className="input-wrapper">
        <input
          type={isPasswordVisible ? "text" : "password"}
          placeholder="Enter your password..."
          value={externalPassword}
          onChange={handleInputChange}
          className="password-input"
        />
        <div className="input-icons-container">
            {externalPassword.length > 0 && (
              <X 
                className="analyzer-icon"
                onClick={handleClearInput}
                size={22}
                style={{ cursor: 'pointer', color: '#435173' }}
              />
            )}
            <div onClick={togglePasswordVisibility} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              {isPasswordVisible ? (
                <EyeOff className="analyzer-icon" size={22} style={{ color: '#435173' }} />
              ) : (
                <Eye className="analyzer-icon" size={22} style={{ color: '#435173' }} />
              )}
            </div>
        </div>
      </div>

      {externalPassword.length > 0 && isPwned !== null && (
        <div className="result-container">
          {/* Pasek postępu */}
          <div className="progress-bar-container">
            <div 
              className={`progress-bar-fill ${getColorClass(score * 2.5)}`} 
              style={{ width: `${Math.max(Math.min(score * 2.5 * 10, 100), 5)}%` }}
            ></div>
          </div>

          {/* Oryginalne dane: Czas łamania hasła */}
          <div className="result-text-box">
            <span className="result-label">ESTIMATED TIME TO CRACK:</span>
            <span className="crack-time-value">{timeToCrackSlow}</span>
          </div>

          {/* Security status - wyświetla się zawsze, ale zmienia komunikat */}
          <div className="result-text-box">
            <span className="result-label">SECURITY STATUS:</span>
            <span style={{ color: isPwned ? '#FF0048' : '#4DFFD8', fontWeight: 'bold' }}>
              {isPwned ? "COMPROMISED" : "SAFE (NOT IN LEAKS)"}
            </span>
          </div>

          {/* Sekcja "Szoku" - wyświetla się tylko jeśli wyciekło */}
          {isPwned && (
            <div className="shock-factor-container">
              <h2 className="shock-title animate-pulse">YOUR PASSWORD IS ON THE DARK WEB, GENIUS</h2>
            </div>
          )}

          {(score < 2 || isPwned) && (
            <div className="fix-password-container">
              <button 
                className="generate-random-btn" 
                onClick={handleFixPassword}
              >
                Fix it for me!
              </button>
            </div>
          )}
          
        </div>
      )}

      <div id="metrics"/>
      <ScoreMetrics strengthResult={strengthResult} />
    </section>
  </>
)
}