import React from 'react';
import Header from './components/Header';
import MainSection from './components/MainSection';
import Footer from './components/Footer';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/style.css';
import './styles/slick.css';

function App() {
  return (
    <div>
      <Header />
      <MainSection />
      <Footer />
    </div>
  );
}

export default App;
