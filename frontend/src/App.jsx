import React, { Suspense, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { RecoilRoot } from "recoil";
import './index.css';
const AdminDashboard = React.lazy(() => import("./pages/Admindashboard"));
const AdminSignin = React.lazy(() => import("./pages/AdminSignin"));
const SignIn = React.lazy(() => import("./pages/Signin"));
const Signup = React.lazy(() => import("./pages/Signup"));
const LandingPage = React.lazy(() => import("./pages/LandingPage"));
const Dashboard = React.lazy(() => import("./pages/dashboard"));

// Keyboard detection component
function KeyboardDetector() {
  const navigate = useNavigate();
  const [, setKeySequence] = useState("");

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Add the pressed key to our sequence
      setKeySequence(prev => {
        // Keep only the last 5 characters to avoid long strings
        const newSequence = (prev + e.key).slice(-5);

        // Check if our sequence contains "admin"
        if (newSequence.toLowerCase().includes("admin")) {
          // Reset sequence after detecting
          setKeySequence("");
          // Redirect to admin signin
          navigate("/admin/signin");
        }

        return newSequence;
      });
    };

    // Add the event listener
    window.addEventListener("keydown", handleKeyDown);

    // Clean up
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate]);

  return null; // This component doesn't render anything
}

function AppRoutes() {
  return (
    <>
      <KeyboardDetector />
      <Routes>
        <Route path="/" element={
          <Suspense fallback={<LoadingAnimation />}>
            <LandingPage />
          </Suspense>
        } />
        <Route path="/signin" element={
          <Suspense fallback={<LoadingAnimation />}>
            <SignIn />
          </Suspense>
        } />
        <Route path="/signup" element={
          <Suspense fallback={<LoadingAnimation />}>
            <Signup />
          </Suspense>
        } />
        <Route path="/dashboard" element={
          <Suspense fallback={<LoadingAnimation />}>
            <Dashboard />
          </Suspense>
        } />
        {/* Add the admin route even though we're redirecting to it via keyboard */}
        <Route path="/admin/signin" element={
          <Suspense fallback={<LoadingAnimation />}>
            <AdminSignin />
          </Suspense>
        } />

        <Route path="/admin/dashboard" element={
          <Suspense fallback={<LoadingAnimation />}>
            <AdminDashboard />
          </Suspense>
        } />
      </Routes>
    </>
  );
}

function App() {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </RecoilRoot>
  );
}

function LoadingAnimation() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="relative w-16 h-16">
        <div className="w-full h-full border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
}

export default App;