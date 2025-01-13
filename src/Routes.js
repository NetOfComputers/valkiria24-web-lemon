import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './screens/Home';
import HomeTrouble from './screens/HomeTrouble.js';
import About from './screens/About';
import Contact from './screens/Contact';
// import BirdViewerAdmin from './screens/BirdViewerAdmin';
// import BirdViewer from './screens/BirdViewer';
import ActiveWorkers from './screens/ActiveWorkers.js';
import ActiveWorkersAdmin from './screens/ActiveWorkersAdmin.js';
import ActiveServiceAdmin from './screens/ActiveServiceAdmin.js';
// import AudioPlayer from './screens/AudioPlayer.js'
import Header from './components/Header';
import Footer from './components/Footer';
// import BirdView from './screens/BirdView.js';
// import BirdViewAdmin from './screens/BirdViewAdmin.js';
// import BirdViewToken from './screens/BirdViewToken.js';
// import BirdPhoto from './screens/BirdPhoto.js';
import BirdViewWithControlsScreen from './screens/BirdViewWithControlsScreen.js';
import BirdViewControls from './screens/BirdViewWithControlsLegacy.js';
import PitViewWithControlsScreen from './screens/PitViewWithControlsScreen.js';

// import BirdViewRecorder from './screens/BirdViewRecorder.js'
import AdminLogin from './screens/AdminLogin.js';
import ProjectArch from './screens/ProjectArch.js';



function AppRoutes() {
  return (
    <Router>
      <Header />
      <Routes>

        {/* MAIN DOMAIN */}
        <Route path="/" element={<Home />} />
        <Route path="/chaos" element={<HomeTrouble />} />


        {/* COMMON SITE */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/sudo" element={<ActiveWorkers />} />

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/for-devs" element={<ProjectArch />} />

        {/* ADMIN ONLY */}
        <Route path="/active-workers" element={<ActiveWorkers />} />
        <Route path="/active-workers/:workerId" element={<ActiveWorkersAdmin />} />
        <Route path="/active-workers/:workerId/service/:serviceId" element={<ActiveServiceAdmin />} />


        {/* BIRD PROJECT */}
        {/* Redirect now to the very new fragmented code*/}
        <Route path="/bird-view" element={<BirdViewWithControlsScreen />} />
        <Route path="/pit-view" element={<PitViewWithControlsScreen />} />

        <Route path="/bird-view-controls" element={<BirdViewWithControlsScreen />} />
        <Route path="/bird-view-controls-legacy" element={<BirdViewControls />} />


        {/* <Route path="/bird-viewer-admin" element={<BirdViewerAdmin />} />
        <Route path="/bird-viewer" element={<BirdViewWithControlsScreen />} /> */}
        {/* <Route path="/bird-listener" element={<AudioPlayer/>} />
        <Route path="/bird-view" element={<BirdView/>} /> */}
        {/* <Route path="/bird-view-recorder" element={<BirdViewRecorder/>} />
        <Route path="/bird-photo" element={<BirdPhoto/>} /> */}
        {/* <Route path="/bird-view/:token" element={<BirdViewToken/>} />
        <Route path="/bird-view-admin" element={<BirdViewAdmin/>} /> */}

        {/* Other projects */}
        <Route path="/guitar-tuner" element={<PitViewWithControlsScreen />} />
      </Routes>
      <Footer flexGrow={1} />
    </Router>
  );
}

export default AppRoutes;
