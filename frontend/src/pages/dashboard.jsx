/* eslint-disable react/prop-types */
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
    const [searchQuery, setSearchQuery] = useState("");

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
                // Handle the events array from the response
                setEvents(eventsRes.data.events || []);
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

    const images_urls = [
        "./bg1.svg", "./bg2.svg", "./bg3.svg","./bg4.svg","./bg5.svg","./bg6.svg","./bg7.svg"
    ]

    const getRandomeimageIndexes = () => {
        const randomNumberBetween0and2 = Math.floor(Math.random() * 6);
        return randomNumberBetween0and2;
    }

    const handleRegisterForEvent = async (eventId) => {
        try {
            setRegistering(true);
            const response = await axios.post(`https://campushub-api.vercel.app/user/register-event/${eventId}`);

            // Update the event in the UI to show registered status
            setEvents(prevEvents =>
                prevEvents.map(event =>
                    event._id === eventId
                        ? { ...event, attendees: [...(event.attendees || []), userProfile._id] }
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
        navigate('/');
    };

    // Helper function to check if an event is registered
    const isEventRegistered = (event) => {
        if (!userProfile || !userProfile._id) return false;

        return Array.isArray(event.attendees) &&
            event.attendees.includes(userProfile._id);
    };

    // Filter events based on search query
    const filterEvents = (eventsArray) => {
        if (!searchQuery.trim()) return eventsArray;

        const query = searchQuery.toLowerCase();
        return eventsArray.filter(event =>
            event.title?.toLowerCase().includes(query) ||
            event.description?.toLowerCase().includes(query) ||
            event.location?.toLowerCase().includes(query)
        );
    };

    // Separate events into registered and unregistered
    const allRegisteredEvents = events.filter(event => isEventRegistered(event));
    const allUnregisteredEvents = events.filter(event => !isEventRegistered(event));

    // Apply search filter
    const registeredEvents = filterEvents(allRegisteredEvents);
    const unregisteredEvents = filterEvents(allUnregisteredEvents);

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

    // Format date/time for display
    const formatEventDateTime = (dateString, timeString) => {
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        return timeString ? `${formattedDate} at ${timeString}` : formattedDate;
    };

    // Event card component for DRY code
    const EventCard = ({ event, isRegistered }) => (
        <div className="border rounded-lg overflow-hidden hover:shadow-md transition">
            <div className="h-40 bg-blue-100 flex items-center justify-center">
                {event.imageUrl ? (
                    <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gray-200">

                        <img
                            src={images_urls[getRandomeimageIndexes()]}
                            alt={event.title}
                            className="w-full h-full object-contain"
                            onError={(e) => (e.currentTarget.style.display = 'none')}
                        />


                    </div>
                )}

            </div>
            <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-800">{event.title}</h3>
                <div className="mt-2 flex items-center text-sm text-gray-600">
                    <span className="mr-2">📅</span>
                    <span>{formatEventDateTime(event.date, event.time)}</span>
                </div>
                <div className="mt-1 flex items-center text-sm text-gray-600">
                    <span className="mr-2">📍</span>
                    <span>{event.location || "On Campus"}</span>
                </div>
                <p className="mt-3 text-gray-600 text-sm line-clamp-2">
                    {event.description || "Join us for this exciting event!"}
                </p>
                <div className="mt-4">
                    {isRegistered ? (
                        <div className="px-4 py-2 bg-green-100 text-green-800 rounded-md text-center">
                            ✓ Registered
                        </div>
                    ) : (
                        <button
                            onClick={() => handleRegisterForEvent(event._id)}
                            disabled={registering}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300"
                        >
                            {registering ? "Registering..." : "Register Now"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

    // Empty state component for no results
    const EmptyState = ({ message, filteredBySearch }) => (
        <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </div>
            <p className="text-gray-500">{message}</p>
            {filteredBySearch && (
                <button
                    onClick={() => setSearchQuery("")}
                    className="mt-3 text-blue-600 hover:underline"
                >
                    Clear search filter
                </button>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Notification */}
            {notification.show && (
                <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg ${notification.type === "success"
                    ? "bg-green-100 text-green-800 border-l-4 border-green-500"
                    : "bg-red-100 text-red-800 border-l-4 border-red-500"
                    } transition-opacity z-50`}>
                    {notification.message}
                </div>
            )}

            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-gray-800">CampusHub</h1>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center gap-2">
                            {/* Circle with First Letter of Username */}
                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white font-medium">
                                {user?.username?.charAt(0).toUpperCase() || userProfile?.username?.charAt(0).toUpperCase()}
                            </div>

                            {/* User Info */}
                            <div className="text-right">
                                <p className="text-sm text-gray-600 text-left">Hello,</p>
                                <p className="font-medium">{user?.username || userProfile?.username}</p>
                            </div>
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
                {/* Search bar section */}
                <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
                    <div className="p-6">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search events by title, description, or location..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            />
                            {searchQuery && (
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>
                        {searchQuery && (
                            <div className="mt-2 text-sm text-gray-600">
                                Found {registeredEvents.length + unregisteredEvents.length} events matching &quot;{searchQuery}&quot;
                            </div>
                        )}
                    </div>
                </div>

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
                                        <p className="font-medium">{userProfile?.username.split("@")[0] || user?.username.split("@")[0] || "Not available"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Events Sections */}
                    <div className="lg:col-span-3 space-y-8">


                        {/* Available Events Section */}
                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            <div className="p-6 border-b bg-blue-50">
                                <h2 className="text-xl font-semibold text-blue-800">Events to Register</h2>
                                <p className="text-gray-600 text-sm mt-1">Upcoming campus events</p>
                            </div>
                            <div className="p-6">
                                {unregisteredEvents.length === 0 ? (
                                    <EmptyState
                                        message={
                                            searchQuery
                                                ? "No available events match your search criteria."
                                                : "No upcoming events available at this time."
                                        }
                                        filteredBySearch={searchQuery && allUnregisteredEvents.length > 0}
                                    />
                                ) : (
                                    <div className="grid gap-6 md:grid-cols-2">
                                        {unregisteredEvents.map((event) => (
                                            <EventCard
                                                key={event._id}
                                                event={event}
                                                isRegistered={false}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Registered Events Section */}
                            <div className="bg-white shadow rounded-lg overflow-hidden">
                                <div className="p-6 border-b bg-green-50">
                                    <h2 className="text-xl font-semibold text-green-800">My Registered Events</h2>
                                    <p className="text-gray-600 text-sm mt-1">Events you are attending</p>
                                </div>
                                <div className="p-6">
                                    {registeredEvents.length === 0 ? (
                                        <EmptyState
                                            message={
                                                searchQuery
                                                    ? "No registered events match your search criteria."
                                                    : "You haven't registered for any events yet."
                                            }
                                            filteredBySearch={searchQuery && allRegisteredEvents.length > 0}
                                        />
                                    ) : (
                                        <div className="grid gap-6 md:grid-cols-2">
                                            {registeredEvents.map((event) => (
                                                <EventCard
                                                    key={event._id}
                                                    event={event}
                                                    isRegistered={true}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}