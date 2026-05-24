import { useState } from 'react';
import generator from 'generate-password-ts';
import './PasswordGenerator.css';

interface GeneratorProps {
  onSendToAnalyzer: (password: string) => void;
}

export default function PasswordGenerator({ onSendToAnalyzer }: GeneratorProps) {
  const [passwordLength, setPasswordLength] = useState<number>(12);
  const [includeLowercase, setIncludeLowercase] = useState<boolean>(true);
  const [includeUppercase, setIncludeUppercase] = useState<boolean>(true);
  const [includeDigits, setIncludeDigits] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(false);
  const [isStrict, setisStrict] = useState<boolean>(false);

  const [generatedPassword, setGeneratedPassword] = useState<string>('');

const handleGenerate = () => {
    const activeOptionsCount = 
      (includeLowercase ? 1 : 0) +
      (includeUppercase ? 1 : 0) +
      (includeDigits ? 1 : 0) +
      (includeSymbols ? 1 : 0);

    if (activeOptionsCount === 0) {
      setGeneratedPassword('SELECT AT LEAST ONE OPTION!');
      return;
    }

    let finalLength = passwordLength;
    if (isStrict && passwordLength < activeOptionsCount) {
      finalLength = activeOptionsCount;
      setPasswordLength(activeOptionsCount);
    }

    try {
      const newPassword = generator.generate({
        length: finalLength,
        lowercase: includeLowercase,
        uppercase: includeUppercase,
        numbers: includeDigits,
        symbols: includeSymbols,
        strict: isStrict
      });
      setGeneratedPassword(newPassword);
    } catch (error) {
      setGeneratedPassword('GENERATION ERROR!');
    }
  };

  return (
    <section className="generator-container" >
      <h2 className="generator-title">GENERATOR SETTINGS</h2>

      {/* RZĄD 1: Opcje znaków oparte na bibliotece generate-password-ts */}
      <div className="settings-row row-bordered row-checkboxes">
        <label className="custom-checkbox">
          <input type="checkbox" checked={includeLowercase} onChange={(e) => setIncludeLowercase(e.target.checked)} />
          <span className="checkbox-dot"></span> LOWERCASES
        </label>

        <label className="custom-checkbox">
          <input type="checkbox" checked={includeUppercase} onChange={(e) => setIncludeUppercase(e.target.checked)} />
          <span className="checkbox-dot"></span> UPPERCASES
        </label>

        <label className="custom-checkbox">
          <input type="checkbox" checked={includeDigits} onChange={(e) => setIncludeDigits(e.target.checked)} />
          <span className="checkbox-dot"></span> DIGITS
        </label>

        <label className="custom-checkbox">
          <input type="checkbox" checked={includeSymbols} onChange={(e) => setIncludeSymbols(e.target.checked)} />
          <span className="checkbox-dot"></span> SPECIAL CHARACTERS
        </label>
        <label className="custom-checkbox">
          <input type="checkbox" checked={isStrict} onChange={(e) => setisStrict(e.target.checked)} />
          <span className="checkbox-dot"></span> STRICT
        </label>
      </div>

      {/* RZĄD 2: Długość hasła */}
      <div className="settings-row row-bordered">
        <span className="length-label">LENGTH OF PASSWORD</span>
        <div className="length-input-badge">
          <input 
            type="number" 
            value={passwordLength} 
            onChange={(e) => setPasswordLength(Math.min(Math.max(Number(e.target.value), 1), 100))}
            className="length-number-input"
          />
        </div>
        <span className="length-label">CHARACTERS</span>
      </div>
      {/* RZĄD 3: Wynik, Prześlij do analizy, Generuj losowy */}
      <div className="action-row">
        {generatedPassword && (
          <div className="output-display" onClick={() => navigator.clipboard.writeText(generatedPassword)}>
            {generatedPassword} <span className="copy-hint">(Click to copy)</span>
          </div>
        )}
        {generatedPassword && generatedPassword !== 'SELECT AT LEAST ONE OPTION!' && (
          <button 
            onClick={() => onSendToAnalyzer(generatedPassword)} 
            className="send-to-analyzer-btn"
            style={{ flex: '1', margin: 0 }}
          >
            ANALYZE
          </button>
        )}
        <button onClick={handleGenerate} className="generate-random-btn">
          GENERATE <span className="bold-text">RANDOM</span>
        </button>
      </div>
    </section>
  );
}