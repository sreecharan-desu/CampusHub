import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { adminState } from "../state/adminAtom";

export default function AdminSignin() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const setAdmin = useSetRecoilState(adminState);

    useEffect(()=>{
        // Redirect to dashboard if admin is already signed in
        if (localStorage.getItem("token")) {
            navigate("/admin/dashboard");
        }
    },[])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Email validation
        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = "Password is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        setServerError("");

        try {
            // Trim and lowercase email before sending
            const email = formData.email.trim().toLowerCase();

            const response = await axios.post("https://campushub-api.vercel.app/admin/signin", {
                email,
                password: formData.password
            });

            if (response.data.success) {
                // Store token in localStorage
                localStorage.setItem("token", response.data.token);

                // Store admin data
                setAdmin(response.data.admin);

                // Redirect to admin dashboard
                navigate("/admin/dashboard");
            }
        } catch (error) {
            console.error("Admin signin error:", error);

            if (error.response?.data?.msg) {
                setServerError(error.response.data.msg);
            } else if (error.response?.data?.errors) {
                // Handle Zod validation errors
                setServerError(error.response.data.errors.join(", "));
            } else {
                setServerError("An error occurred during sign in. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
            <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-extrabold text-white text-center">CampusHub</h1>
                <h2 className="mt-4 text-xl font-semibold text-gray-300 text-center">Admin Portal</h2>
                <p className="mt-2 text-sm text-gray-400 text-center">Authorized personnel only</p>

                {serverError && (
                    <div className="mt-4 p-3 bg-red-900 border border-red-700 text-red-100 rounded text-center">
                        {serverError}
                    </div>
                )}

                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Email address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full mt-1 px-4 py-2 rounded-md bg-gray-700 text-white border ${errors.email ? "border-red-500" : "border-gray-600"
                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="admin@example.com"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300">Password</label>
                        <div className="relative mt-1">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 rounded-md bg-gray-700 text-white border ${errors.password ? "border-red-500" : "border-gray-600"
                                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-3 flex items-center text-gray-400"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "🙈" : "👁️"}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {isSubmitting ? "Signing in..." : "Admin Sign In"}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-400">
                    Return to <Link to="/" className="text-blue-400 hover:text-blue-300">main site</Link>
                </div>
            </div>
        </div>
    );
}