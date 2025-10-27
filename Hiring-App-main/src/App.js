import './App.css';
import { useAuth0 } from '@auth0/auth0-react';
import Navbar from './components/Navbar/Navbar';
import { Route, Routes, useNavigate } from 'react-router-dom';
import HRDashboard from './components/HR_dash/HRDashboard';
import CustomerPage from './components/Candidate/CustomerPage';
import UploadResume from './components/Candidate/UploadResume';
import JobCreation from './components/HR_dash/JobCreation/JobCreation';
import { useEffect } from 'react';
import ShortlistedCandidates from './components/HR_dash/shortlist/shortlist';
import { ToastContainer } from 'react-toastify';
import Hr_profile from './components/HR_dash/ProfilePage/hr_profile';

const allowedDomains = ["citchennai.net"];

function App() {
  const { loginWithRedirect, user, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  const getUserDomain = (email) => email.split("@")[1];
  const isAuthorized = user && allowedDomains.includes(getUserDomain(user.email));

  useEffect(() => {
    if (isAuthenticated && isAuthorized) {
      setTimeout(() => {
        if (window.location.pathname === "/") {
          navigate("/hr-dashboard");
        }
      }, 500); // Small delay to prevent unwanted redirects
    }
  }, [isAuthenticated, isAuthorized, navigate]);

  return (
    <div className='App'>
      <Navbar isAuthorized={isAuthorized} />
      <ToastContainer />
      <Routes>
        {isAuthorized ? (
          <>
            <Route path="/hr-dashboard" element={<HRDashboard />} />
            <Route path="/hr-dashboard/profile" element={<Hr_profile />} />
            <Route path="/hr-dashboard/create-job" element={<JobCreation />} />
            <Route path="/hr-dashboard/job/:jobId" element={<ShortlistedCandidates />} />
          </>
        ) : (
          <>
            <Route path="/" element={<CustomerPage />} />
            <Route path="/upload/:jobId" element={<UploadResume />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;

