import {useEffect, useState } from 'react'
import { zxcvbn, zxcvbnOptions} from '@zxcvbn-ts/core';
import type { ZxcvbnResult } from '@zxcvbn-ts/core';
import { translations } from '@zxcvbn-ts/language-en';
import { adjacencyGraphs, dictionary } from '@zxcvbn-ts/language-common';
import './PasswordAnalyzer.css'
import ScoreMetrics from './ScoreMetrics';
import { Eye, EyeOff, X } from 'lucide-react';

zxcvbnOptions.setOptions({
  translations: translations,
  dictionary: {
    ...dictionary,
  },
  graphs: adjacencyGraphs,
});
interface AnalyzerProps {
  externalPassword: string;
  onPasswordChange: (value: string) => void;
}

export default function PasswordAnalyzer({ externalPassword, onPasswordChange }: AnalyzerProps) {
  const [strengthResult, setStrengthResult] = useState<ZxcvbnResult | null>(null)

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
  };
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  useEffect(() => {
    runAnalysis(externalPassword);
  }, [externalPassword]);
  const score = strengthResult?.score ?? 0;
  const timeToCrack = strengthResult?.crackTimesDisplay?.offlineFastHashing1e10PerSecond ?? '';

return (
    <>
      <section className="analyzer-card">
        <div >
          <h2>CHECK THE STRENGTH OF YOUR</h2>
          <h1>PASSWORD</h1>
        </div>
      <div className="input-wrapper">
        <input
          type={isPasswordVisible ? "text" : "password"}
          placeholder="Enter password..."
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
                style={{ cursor: 'pointer', marginRight: '10px', color: '#64748b' }}
              />
            )}
            <div onClick={togglePasswordVisibility} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              {isPasswordVisible ? (
                <EyeOff className="analyzer-icon" size={22} style={{ color: '#64748b' }} />
              ) : (
                <Eye className="analyzer-icon" size={22} style={{ color: '#64748b' }} />
              )}
            </div>
        </div>
      </div>
        <ScoreMetrics strengthResult={strengthResult} />
      {externalPassword.length > 0 && (
        <div className="result-container">
          
          <div className="progress-bar-container">
            <div className="progress-bar-fill" data-score={score}></div>
          </div>

          <div className="result-text-box">
            <span className="result-label">ESTIMATED TIME TO CRACK:</span>
            <span className="crack-time-value">{timeToCrack}</span>
          </div>
        </div>
      )
      }
      </section></>
  )
}
