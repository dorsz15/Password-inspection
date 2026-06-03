import { useState, useEffect, useRef} from 'react';
import { breachStories} from '../components/BreachedStories';
import { scrollToSection } from '../Navigator';
import {KeyRound, ChartBar, Dices, ShieldHalf, Users} from 'lucide-react';
import { NeatGradient } from "@firecms/neat";

import '../App.css';
import PasswordAnalyzer from '../components/PasswordAnalyzer';
import PasswordGenerator from '../components/PasswordGenerator';
import Footer from '../components/Footer';

function Home() {
  
  const [analyzedPassword, setAnalyzedPassword] = useState('');
  const handleSendToAnalyzer = (password: string) => {
    setAnalyzedPassword(password);
    
    window.scrollTo({
      top: 100,
      behavior: 'smooth'
    });
  };

  const [factIndex, setFactIndex] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const gradient = new NeatGradient({
      ref: canvasRef.current,
      colors: [
        { color: '#110B4D', enabled: true },
        { color: '#110B4D', enabled: true },
        { color: '#040016', enabled: true },
        { color: '#040016', enabled: true },
        { color: '#110B4D', enabled: true },
        { color: '#040016', enabled: true },
      ],
      speed: 3,
      horizontalPressure: 3,
      verticalPressure: 4,
      waveFrequencyX: 2,
      waveFrequencyY: 3,
      waveAmplitude: 5,
      shadows: 1,
      highlights: 5,
      colorBrightness: 1,
      colorSaturation: 7,
      wireframe: false,
      colorBlending: 8,
      backgroundColor: '#110B4D',
      backgroundAlpha: 1,
      grainScale: 1,
      grainSparsity: 0,
      grainIntensity: 0.225,
      grainSpeed: 0.8,
      resolution: 1,
      yOffset: 1282,
      yOffsetWaveMultiplier: 4,
      yOffsetColorMultiplier: 4,
      yOffsetFlowMultiplier: 4,
      flowDistortionA: 1.4,
      flowDistortionB: 4.2,
      flowScale: 1,
      flowEase: 0,
      flowEnabled: true,
      enableProceduralTexture: false,
      textureVoidLikelihood: 0.45,
      textureVoidWidthMin: 200,
      textureVoidWidthMax: 486,
      textureBandDensity: 2.15,
      textureColorBlending: 0.01,
      textureSeed: 333,
      textureEase: 0.5,
      proceduralBackgroundColor: '#<n>000000</n>',
      textureShapeTriangles: 20,
      textureShapeCircles: 15,
      textureShapeBars: 15,
      textureShapeSquiggles: 10,
      domainWarpEnabled: false,
      domainWarpIntensity: 0,
      domainWarpScale: 3,
      vignetteIntensity: 1,
      vignetteRadius: 0.7,
      fresnelEnabled: false,
      fresnelPower: 2,
      fresnelIntensity: 0.5,
      fresnelColor: '#FFFFFF',
      iridescenceEnabled: false,
      iridescenceIntensity: 0.5,
      iridescenceSpeed: 1,
      bloomIntensity: 0,
      bloomThreshold: 0.7,
      chromaticAberration: 0,
    });

    setFactIndex(Math.floor(Math.random() * breachStories.length));
    return () => {
      gradient.destroy();
    };
  }, []);

  // Funkcje nawigacji
  const nextFact = () => setFactIndex((prev) => (prev + 1) % breachStories.length);
  const prevFact = () => setFactIndex((prev) => (prev - 1 + breachStories.length) % breachStories.length);

  const currentFact = breachStories[factIndex];


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
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
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
      
      {/* Kontener nadrzędny z relative, żeby przyciski były wewnątrz niego */}
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        
        {/* Karta z sztywną szerokością 950px */}
        <div className="info-card" style={{ width: '950px', position: 'relative' }}>
          
          {/* Przycisk < - teraz wewnątrz karty, wyśrodkowany pionowo */}
          <button 
            onClick={prevFact} 
            style={{ 
              position: 'absolute', left: '-75px', top: '50%', transform: 'translateY(-50%)',
              background: 'transparent', border: '1px solid #96ADFF', color: '#96ADFF', 
              cursor: 'pointer', fontSize: '20px', width: '50px', height: '50px',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            {"<"}
          </button>

          {/* Treść karty */}
          <h3 style={{ margin: '0 0 10px 0', fontSize: '22px', textTransform: 'uppercase', letterSpacing: '1px', color: '#white' }}>
            {currentFact.company}
          </h3>
          <h2 style={{ fontSize: '20px', marginBottom: '25px', color: '#white' }}>
            {currentFact.title}
          </h2>
          <p style={{ lineHeight: '1.6', fontSize: '20px', color: '#96ADFF' }}>
            {currentFact.description}
          </p>
          <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '20px', opacity: 0.5 }}>
            Fact {factIndex + 1} / {breachStories.length}
          </div>

          {/* Przycisk > - wewnątrz karty, wyśrodkowany pionowo */}
          <button 
            onClick={nextFact} 
            style={{ 
              position: 'absolute', right: '-75px', top: '50%', transform: 'translateY(-50%)',
              background: 'transparent', border: '1px solid #96ADFF', color: '#96ADFF', 
              cursor: 'pointer', fontSize: '20px', width: '50px', height: '50px',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            {">"}
          </button>

        </div>
      </div>
    </section>
      </div>
      
      {/* Stopka*/}
      <Footer />
      <div id="authors"/>

    </>
  );
}

export default Home;