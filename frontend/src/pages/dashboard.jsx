import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userState } from "../state/userAtom";
import axios from "axios";

export default function Dashboard() {
    const navigate = useNavigate();
    const user = useRecoilValue(userState);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [registering, setRegistering] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: "", type: "" });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/signin');
            return;
        }

        // Set up axios defaults for all requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Fetch both profile and events data
        const fetchData = async () => {
            try {
                setLoading(true);
                const [profileRes, eventsRes] = await Promise.all([
                    axios.get('https://campushub-api.vercel.app/user/profile'),
                    axios.get('https://campushub-api.vercel.app/user/events')
                ]);

                setUserProfile(profileRes.data.user);
                setEvents(eventsRes.data.events);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError(err.response?.data?.msg || "Failed to load dashboard data");

                // Handle unauthorized errors (expired token)
                if (err.response?.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/signin');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    const handleRegisterForEvent = async (eventId) => {
        try {
            setRegistering(true);
            const response = await axios.post(`https://campushub-api.vercel.app/user/register-event/${eventId}`);

            // Update the event in the UI to show registered status
            setEvents(prevEvents =>
                prevEvents.map(event =>
                    event._id === eventId
                        ? { ...event, isRegistered: true }
                        : event
                )
            );

            // Show success notification
            setNotification({
                show: true,
                message: response.data.msg || "Registered successfully!",
                type: "success"
            });

            // Hide notification after 3 seconds
            setTimeout(() => {
                setNotification({ show: false, message: "", type: "" });
            }, 3000);

        } catch (err) {
            console.error("Registration error:", err);

            setNotification({
                show: true,
                message: err.response?.data?.msg || "Failed to register for event",
                type: "error"
            });

            setTimeout(() => {
                setNotification({ show: false, message: "", type: "" });
            }, 3000);
        } finally {
            setRegistering(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/signin');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-700">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Dashboard</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Notification */}
            {notification.show && (
                <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg ${notification.type === "success" ? "bg-green-100 text-green-800 border-l-4 border-green-500" :
                        "bg-red-100 text-red-800 border-l-4 border-red-500"
                    } transition-opacity z-50`}>
                    {notification.message}
                </div>
            )}

            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-gray-800">CampusHub</h1>
                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                            <p className="text-sm text-gray-600">Hello,</p>
                            <p className="font-medium">{user?.username || userProfile?.username}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-3 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition text-sm"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Profile Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            <div className="p-6 bg-blue-600 text-white">
                                <h2 className="text-xl font-semibold">Profile</h2>
                            </div>
                            <div className="p-6">
                                <div className="mb-4 flex justify-center">
                                    <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600">
                                        {(userProfile?.username?.[0] || user?.username?.[0] || "U").toUpperCase()}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-500">Username</p>
                                        <p className="font-medium">{userProfile?.username || user?.username}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-medium">{userProfile?.email || user?.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Student ID</p>
                                        <p className="font-medium">{userProfile?.username || user?.username}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Events Section */}
                    <div className="lg:col-span-3">
                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            <div className="p-6 border-b">
                                <h2 className="text-xl font-semibold">Upcoming Events</h2>
                                <p className="text-gray-500 text-sm mt-1">Register for campus events</p>
                            </div>
                            <div className="p-6">
                                {events.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">No upcoming events at this time.</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-6 md:grid-cols-2">
                                        {events.map((event) => (
                                            <div key={event._id} className="border rounded-lg overflow-hidden hover:shadow-md transition">
                                                <div className="h-40 bg-blue-100 flex items-center justify-center">
                                                    {event.imageUrl ? (
                                                        <img
                                                            src={event.imageUrl}
                                                            alt={event.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="text-5xl text-blue-300">🎓</div>
                                                    )}
                                                </div>
                                                <div className="p-4">
                                                    <h3 className="font-semibold text-lg text-gray-800">{event.title}</h3>
                                                    <div className="mt-2 flex items-center text-sm text-gray-600">
                                                        <span className="mr-2">📅</span>
                                                        <span>{new Date(event.date).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="mt-1 flex items-center text-sm text-gray-600">
                                                        <span className="mr-2">📍</span>
                                                        <span>{event.location || "On Campus"}</span>
                                                    </div>
                                                    <p className="mt-3 text-gray-600 text-sm line-clamp-2">
                                                        {event.description || "Join us for this exciting event!"}
                                                    </p>
                                                    <div className="mt-4">
                                                        {event.isRegistered ? (
                                                            <div className="px-4 py-2 bg-green-100 text-green-800 rounded-md text-center">
                                                                ✓ Registered
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleRegisterForEvent(event._id)}
                                                                disabled={registering}
                                                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:bg-blue-300"
                                                            >
                                                                {registering ? "Registering..." : "Register Now"}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}