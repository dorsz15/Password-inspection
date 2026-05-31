import { useState} from 'react';
import { Canvas } from '@react-three/fiber';
import { scrollToSection } from './Navigator';
import {KeyRound, ChartBar, Dices, ShieldHalf, Users} from 'lucide-react';

import './App.css';
import PasswordAnalyzer from './components/PasswordAnalyzer';
import PasswordGenerator from './components/PasswordGenerator';
import Footer from './components/Footer';
import Particles from './components/Particles';

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
    {/* Nawigacja*/}
    <nav className="navbar">

      {/*logo*/}
      <div className="navbar-logo">
        <ShieldHalf size={20} className='nav-icon' color='#7284b0'/>
        PASSWORD CHECKER
      </div>

      <div className="navbar-buttons">
        {/* Button to password*/}
        <button className="navbar-button" 
                onClick={() => scrollToSection('enter-password')}>
          <KeyRound size={20} className="nav-icon" />
          PASSWORD
        </button>

        {/* Button to metrics*/}
        <button className="navbar-button" 
                onClick={() => scrollToSection('metrics')}>
          <ChartBar size={20} className="nav-icon" />
          METRICS
        </button>

        {/* Button to generator*/}
        <button className="navbar-button" 
                onClick={() => scrollToSection('generator')}>
          <Dices size={20} className="nav-icon" />
          GENERATOR
        </button>

        {/* Button to  github*/}
        <button className="navbar-button" 
                onClick={() => scrollToSection('authors')}>
          <Users size={20} className="nav-icon" />
          CREATORS
        </button>
      </div>

    </nav>

      <div className="blob-container">
        {/*
          <Canvas camera={{ position: [0, 0, 5] }}>
            <Particles />
          </Canvas>
          */}
      </div>

      <div id="enter-password"/>
      <div className="app-container">  

          <PasswordAnalyzer 
            externalPassword={analyzedPassword} 
            onPasswordChange={setAnalyzedPassword}/>

          <div id="generator"/>
          <div className="app-divider"/>

          <PasswordGenerator 
            onSendToAnalyzer={handleSendToAnalyzer}/>
          
          <div className="app-divider" />

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
      
      <div id="authors"/>
      {/* Stopka*/}
      <Footer />
    </>
  );
}

export default App;