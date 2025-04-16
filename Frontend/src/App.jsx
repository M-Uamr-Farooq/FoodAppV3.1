import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Buyer_signup from './components/Buyer_signup';
import Buyer_signin from './components/Buyer_signin';
import Landing from './components/Landing';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/Buyer_signup" element={<Buyer_signup />} />
          <Route path="/Buyer_signin" element={<Buyer_signin />} />
          <Route path="/landing" element={<Landing />} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
