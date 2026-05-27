
import { useState } from 'react';
import './App.css';
import PasswordAnalyzer from './components/PasswordAnalyzer';
import PasswordGenerator from './components/PasswordGenerator';
import Footer from './components/Footer';

function App() {

  const [analyzedPassword, setAnalyzedPassword] = useState('');
  const handleSendToAnalyzer = (password: string) => {
    setAnalyzedPassword(password);
    
    window.scrollTo({
      top: 100,
      behavior: 'smooth'
    });
  };
  return (
    <>
      <div className="app-container">  
        <div className="dashboard-layout">
          <PasswordAnalyzer 
          externalPassword={analyzedPassword} 
          onPasswordChange={setAnalyzedPassword}/>
          <hr className="app-divider" />
          <PasswordGenerator 
          onSendToAnalyzer={handleSendToAnalyzer}/>
          <hr className="app-divider" />
        </div>

        {/* Sekcja: Why make a secure password */}
        <section className="info-section">
        <h2 className="info-title">WHY MAKE A SECURE PASSWORD?</h2>
        <div className="info-content">
          <p>
            Your password is the first line of defense against cyber threats. In an era where 
            data breaches occur daily, using weak or recycled passwords leaves your personal 
            information, financial accounts, and digital identity highly vulnerable to hackers. 
            A robust password acts as a strong barrier, significantly reducing the risk of unauthorized access.
          </p>
          <p>
            Automated cyberattacks, such as brute-force and dictionary attacks, can crack simple passwords 
            in a matter of seconds. By incorporating a mix of upper and lowercase letters, numbers, and 
            special characters, you exponentially increase the complexity and entropy of your credentials, 
            making it mathematically exhausting for malicious scripts to guess them.
          </p>
          <p>
            Securing your accounts goes beyond protecting just yourself. Compromised accounts are 
            frequently used to spread malware, launch phishing campaigns against your contacts, or gain 
            footholds into corporate networks. Investing a few moments into creating unique, complex 
            passwords is a crucial step toward building a safer digital environment for everyone.
          </p>
        </div>
      </section>

      <hr className="app-divider" />

      {/* Sekcja: Fun facts */}
      <section className="info-section">
        <h2 className="info-title">FUN FACTS ABOUT PASSWORD SECURITY</h2>
        <div className="info-content">
          <p>
            Did you know that adding just one uppercase letter and a single special character can turn 
            a password that takes seconds to crack into one that takes years? Furthermore, long phrases 
            (passphrases) are often much more secure and easier to remember than short, complex strings. 
            Despite constant warnings, studies show that "123456" and "password" still consistently rank 
            as the most commonly used passwords worldwide every single year.
          </p>
        </div>
      </section>
      </div>

      {/* Stopka*/}
      <Footer />
    </>
  );
}

export default App;