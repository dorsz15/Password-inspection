import { useState } from 'react'
import { zxcvbn, zxcvbnOptions} from '@zxcvbn-ts/core';
import type { ZxcvbnResult } from '@zxcvbn-ts/core';
import { translations } from '@zxcvbn-ts/language-en';
import './App.css'

zxcvbnOptions.setOptions({
  translations: translations,
});

function App() {
  const [password, setPassword] = useState('')
  const [strengthResult, setStrengthResult] = useState<ZxcvbnResult | null>(null)
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    if (newPassword.length > 0){
      const result = zxcvbn(newPassword);
      setStrengthResult(result);
    }
    else{
      setStrengthResult(null)
    }
  }

  const score = strengthResult?.score ?? 0;
  const timeToCrack = strengthResult?.crackTimesDisplay?.offlineFastHashing1e10PerSecond ?? '';

  return (
    <>
      <section id="center">
        <div>
          <h2>CHECK THE STRENGTH OF YOUR</h2>
          <h1>PASSWORD</h1>
        </div>
      <div className="input-wrapper">
        <input
          type="password"
          placeholder="Enter password..."
          value={password}
          onChange={handleInputChange}
          className="password-input"
        />
        <div className="input-icons-container">
          <span className="icon-placeholder">✕</span>
          <span className="icon-placeholder">👁</span>
        </div>
      </div>
      {password.length > 0 && (
        <div className="result-container">
          
          <div className="progress-bar-container">
            <div className="progress-bar-fill" data-score={score}></div>
          </div>

          <div className="result-text-box">
            <span className="result-label">ESTIMATED TIME TO CRACK:</span>
            <span className="crack-time-value">{timeToCrack}</span>
          </div>

        </div>
      )}
      </section>
      <section id="spacer"></section></>
  )
}

export default App
