
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
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. In in dictum nulla. 
              Cras vestibulum mollis enim tristique commodo. Interdum et malesuada fames 
              ac ante ipsum primis in faucibus. Aliquam purus eros, imperdiet et faucibus 
              vehicula, facilisis in tellus. Proin id est vel dolor efficitur scelerisque 
              at eget sem. In sagittis magna eu ex rhoncus commodo. Vestibulum convallis 
              venenatis ante ac egestas.
            </p>
            <p>
              Morbi id mauris sodales, fringilla odio et, viverra tellus. Phasellus vel 
              aliquet urna. Sed lacinia risus id mattis commodo. Nulla gravida vulputate 
              nunc non dignissim. Sed nisl odio, ornare sit amet tristique a, malesuada 
              at nunc. Duis interdum sem mi, nec tincidunt dui consequat sed. Mauris a 
              leo et mauris dapibus pellentesque. Nullam commodo convallis nulla non suscipit.
            </p>
            <p>
              Donec aliquet dignissim nisi ut sodales. Duis faucibus facilisis vulputate. 
              Sed ultrices gravida ante eu ornare. Aliquam sagittis eu justo id aliquam. 
              Donec lacinia vel erat ut cursus. Duis tempor massa porta, pellentesque diam et, 
              porta sapien. Nunc quis porta eros. Nam cursus dui vitae eros congue scelerisque. 
              Pellentesque vitae scelerisque nisl, sed egestas odio. Aliquam in justo lacus. 
              Nullam efficitur nulla eget eros porta, et posuere tellus elementum. Nulla a magna 
              eu neque facilisis gravida. Suspendisse maximus purus a consequat lobortis. 
              Nulla facilisi. Phasellus finibus quis turpis ac porttitor.
            </p>
          </div>
        </section>

        <hr className="app-divider" />

        {/* Sekcja: Fun facts */}
        <section className="info-section">
          <h2 className="info-title">FUN FACTS ABOUT PASSWORD SECURITY</h2>
          <div className="info-content">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. In in dictum nulla. 
              Cras vestibulum mollis enim tristique commodo. Interdum et malesuada fames 
              ac ante ipsum primis in faucibus. Aliquam purus eros, imperdiet et faucibus 
              vehicula, facilisis in tellus. Proin id est vel dolor efficitur scelerisque 
              at eget sem. In sagittis magna eu ex rhoncus commodo. Vestibulum convallis 
              venenatis ante ac egestas.
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