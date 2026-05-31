import {useEffect, useState } from 'react'
import { zxcvbn, zxcvbnOptions} from '@zxcvbn-ts/core';
import type { ZxcvbnResult } from '@zxcvbn-ts/core';
import { translations } from '@zxcvbn-ts/language-en';
import { adjacencyGraphs, dictionary as commonDictionary } from '@zxcvbn-ts/language-common';
import { dictionary as plDictionary, translations as plTranslations } from '@zxcvbn-ts/language-pl';

import './PasswordAnalyzer.css'
import './../App.css';

import ScoreMetrics from './ScoreMetrics';
import {roastPassword} from './../AiRoaster'
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

  const handleRoastClick = async (result: ZxcvbnResult) => {
    const patterns = result.sequence.map((s: any) => s.pattern);
    const roast = await roastPassword(result.score, patterns);
    setRoastMessage(roast);
  };

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

  setRoastMessage(''); 
  if (!externalPassword) {
    setStrengthResult(null);
    setIsPwned(null);
    return;
  }

  const result = zxcvbn(externalPassword);
  setStrengthResult(result);

  /*Check if password is pawned*/
  checkPasswordPwned(externalPassword).then(setIsPwned);

  const timer = setTimeout(() => {
    handleRoastClick(result);
  }, 2000);

  return () => clearTimeout(timer);
}, [externalPassword]);

  const score = strengthResult?.score ?? 0;
  //const timeToCrack = strengthResult?.crackTimesDisplay?.offlineFastHashing1e10PerSecond ?? '';
  const timeToCrackSlow = strengthResult?.crackTimesDisplay?.offlineSlowHashing1e4PerSecond ?? '';

return (
    <>
      <section className="analyzer-card">
        <div >
          <h2 className="analyzer-subtitle">CHECK THE <span className='analyzer-strong'>STRENGTH</span> OF YOUR</h2>
          <h1 className="analyzer-title">PASSWORD</h1>
          <h2 >"...{roastMessage}"</h2>
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
      {externalPassword.length > 0 && (
        <div className="result-container">
          
          <div className="progress-bar-container">
            <div className="progress-bar-fill" data-score={score}></div>
          </div>

          <div className="result-text-box">
            <span className="result-label">ESTIMATED TIME TO CRACK:</span>
            <span className="crack-time-value">{timeToCrackSlow}</span>
          </div>

          <div className="result-text-box">
            <span className="result-label">SECURITY STATUS:</span>
            <span style={{ color: isPwned ? '#FF0048' : '#4DFFD8', fontWeight: 'bold' }}>
              {isPwned ? "COMPROMISED (FOUND IN LEAKS!)" : "SAFE (NOT IN LEAKS)"}
            </span>
          </div>
        </div>
      )
      }
      <div id="metrics"/>
        <ScoreMetrics strengthResult={strengthResult} />
      </section></>
  )
}
