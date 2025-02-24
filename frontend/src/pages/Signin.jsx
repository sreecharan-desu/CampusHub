import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { userState } from '../state/userAtom';
import axios from 'axios';

export default function SignIn() {

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/dashboard');
        }
    }, []);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [emailError, setEmailError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const setUser = useSetRecoilState(userState);
    
    const validateEmail = (email) => {
        const trimmedEmail = email.trim().toLowerCase();
        const validDomain = '@rguktong.ac.in';
        
        if (!trimmedEmail.endsWith(validDomain)) {
            return { valid: false, message: 'Email must end with @rguktong.ac.in' };
        }
        
        const username = trimmedEmail.split('@')[0];
        if (!username.startsWith('o')) {
            return { valid: false, message: 'Email must start with letter "o"' };
        }
        
        return { valid: true, normalizedEmail: trimmedEmail };
    };
    
    const handleEmailChange = (e) => {
        const inputEmail = e.target.value;
        setEmail(inputEmail);
        
        if (inputEmail) {
            const validation = validateEmail(inputEmail);
            setEmailError(validation.valid ? '' : validation.message);
        } else {
            setEmailError('');
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
        const validation = validateEmail(email);
        if (!validation.valid) {
            setEmailError(validation.message);
            return;
        }
        
        setIsLoading(true);
        
        try {
            // Use normalized (trimmed and lowercase) email for the API request
            const normalizedEmail = validation.normalizedEmail;
            
            const response = await axios.post('https://campushub-api.vercel.app/user/signin', {
                email: normalizedEmail,
                password
            });
            
            const { token, user } = response.data;
            
            localStorage.setItem('token', token);
            setUser(user);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.msg || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-100">
            <div className="bg-white p-8 rounded-xl shadow-xl w-96 border border-gray-200">
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">Welcome Back!</h2>
                    <p className="text-gray-600 mt-2">Sign in to access your account</p>
                </div>
                
                {error && (
                    <div className="bg-red-50 p-3 rounded-lg mb-4 border-l-4 border-red-500">
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Email Address</label>
                        <input
                            type="email"
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 bg-gray-50 hover:bg-white ${emailError ? 'border-red-500' : 'border-gray-300'}`}
                            value={email}
                            onChange={handleEmailChange}
                            placeholder="o123456@rguktong.ac.in"
                            required
                        />
                        {emailError && (
                            <p className="text-red-500 text-xs mt-1">{emailError}</p>
                        )}
                        <p className="text-gray-500 text-xs mt-1">Email must start with (o) and end with (@rguktong.ac.in) currently only for rgukt students.</p>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-gray-700 font-medium">Password</label>
                        </div>
                        <input
                            type="password"
                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 bg-gray-50 hover:bg-white"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 font-medium shadow-md disabled:bg-blue-400 disabled:cursor-not-allowed"
                        disabled={isLoading || emailError}
                    >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
                
                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        Dont have an account?{' '}
                        <a href="/signup" className="text-blue-600 hover:underline font-medium">
                            Sign up
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}