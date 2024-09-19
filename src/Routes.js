import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './screens/Home';
import About from './screens/About';
import Contact from './screens/Contact';
import BirdViewerAdmin from './screens/BirdViewerAdmin';
import BirdViewer from './screens/BirdViewer';
import ActiveWorkers from './screens/ActiveWorkers.js';
import ActiveWorkersAdmin from './screens/ActiveWorkersAdmin.js';
import ActiveServiceAdmin from './screens/ActiveServiceAdmin.js';
import AudioPlayer from './screens/AudioPlayer.js'
import Header from './components/Header';
import Footer from './components/Footer';

function AppRoutes() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/bird-viewer-admin" element={<BirdViewerAdmin />} />
        <Route path="/bird-viewer" element={<BirdViewer />} />
        <Route path="/active-workers" element={<ActiveWorkers />} />
        <Route path="/active-workers/:workerId" element={<ActiveWorkersAdmin />} />
        <Route path="/active-workers/:workerId/service/:serviceId" element={<ActiveServiceAdmin />} />
        <Route path="/bird-listener" element={<AudioPlayer/>} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default AppRoutes;
