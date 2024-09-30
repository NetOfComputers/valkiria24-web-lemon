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
import BirdView from './screens/BirdView.js';
import BirdViewAdmin from './screens/BirdViewAdmin.js';
import BirdViewToken from './screens/BirdViewToken.js';
import BirdPhoto from './screens/BirdPhoto.js';
import BirdViewSocketio from './screens/BirdViewSocketio.js';

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
        <Route path="/bird-view" element={<BirdView/>} />
        <Route path="/bird-view-socketio" element={<BirdViewSocketio/>} />
        <Route path="/bird-photo" element={<BirdPhoto/>} />
        <Route path="/bird-view/:token" element={<BirdViewToken/>} />
        <Route path="/bird-view-admin" element={<BirdViewAdmin/>} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default AppRoutes;
