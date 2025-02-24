import React, { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RecoilRoot } from "recoil";
import './index.css'
import SignIn from "./pages/Signin";
const LandingPage = React.lazy(() => import("./pages/LandingPage"));
const Dashboard = React.lazy(() => import("./pages/dashboard"));

function App() {
    return (
        <RecoilRoot>
            <BrowserRouter>
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
                    <Route path="/dashboard" element={<Dashboard/>} />
                </Routes>
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