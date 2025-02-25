/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { adminState } from "../state/adminAtom";
import {
    Calendar, ChevronLeft, LogOut, Menu,
    PieChart, Users, Plus, Edit,
    Trash2, Eye, AlertTriangle,
    Download
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
    const [admin, setAdmin] = useRecoilState(adminState);
    const [events, setEvents] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [notifications, setNotifications] = useState([]);
    const [isCreatingEvent, setIsCreatingEvent] = useState(false);
    const [isEditingEvent, setIsEditingEvent] = useState(false);
    const navigate = useNavigate();
    const [eventForm, setEventForm] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        capacity: 0,
        price: 0
    });
    const [error, setError] = useState('');

    // Configure axios with auth token
    useEffect(() => {
        if (localStorage.getItem("token")) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("token")}`;
        }
    }, [admin]);


    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate('/')
        }
    }, [])
    // Fetch initial data
    useEffect(() => {
        fetchProfile();
        fetchEvents();
    }, []);

    // API Functions
    const fetchProfile = async () => {
        try {
            const response = await axios.get('https://campushub-api.vercel.app/admin/profile');
            if (response.data.success) {
                setAdmin(prevState => ({ ...prevState, ...response.data.admin }));
            }
        } catch (error) {
            console.log(error);
            handleError('Failed to load profile');
        }
    };

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://campushub-api.vercel.app/admin/events');
            if (response.data.success) {
                setEvents(response.data.events);
            }
        } catch (error) {
            console.log(error);
            handleError('Failed to load events');
        } finally {
            setLoading(false);
        }
    };

    const fetchEventRegistrations = async (eventId) => {
        try {
            const response = await axios.get(`https://campushub-api.vercel.app/admin/event/${eventId}/registrations`);
            if (response.data.success) {
                setRegistrations(response.data.registrations);
                setSelectedEvent(events.find(event => event._id === eventId));
                setActiveTab('registrations');
            }
        } catch (error) {
            console.log(error);
            handleError('Failed to load registrations');
        }
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://campushub-api.vercel.app/admin/create-event', eventForm);
            if (response.data.success) {
                setEvents([...events, response.data.event]);
                setIsCreatingEvent(false);
                resetEventForm();
                addNotification(`Event "${response.data.event.title}" created successfully`);
            }
        } catch (error) {
            console.log(error);
            handleError('Failed to create event');
        }
    };

    const handleUpdateEvent = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`https://campushub-api.vercel.app/admin/edit-event/${selectedEvent._id}`, eventForm);
            if (response.data.success) {
                setEvents(events.map(event => event._id === selectedEvent._id ? response.data.event : event));
                setIsEditingEvent(false);
                setSelectedEvent(null);
                addNotification(`Event "${response.data.event.title}" updated successfully`);
            }
        } catch (error) {
            console.log(error);
            handleError('Failed to update event');
        }
    };

    const handleDeleteEvent = async (eventId) => {
        if (!confirm('Are you sure you want to delete this event?')) return;

        try {
            const response = await axios.delete(`https://campushub-api.vercel.app/admin/delete-event/${eventId}`);
            if (response.data.success) {
                setEvents(events.filter(event => event._id !== eventId));
                addNotification('Event deleted successfully');
            }
        } catch (error) {
            console.log(error);
            handleError('Failed to delete event');
        }
    };

    // Helper Functions
    const addNotification = (text) => {
        setNotifications([
            { id: Date.now(), text, time: 'Just now' },
            ...notifications
        ]);
    };

    const handleError = (message) => {
        setError(message);
        console.error(message);
        setTimeout(() => setError(''), 5000); // Auto-dismiss after 5 seconds
    };

    const resetEventForm = () => {
        setEventForm({
            title: '',
            description: '',
            date: '',
            time: '',
            location: '',
            capacity: 0,
            price: 0
        });
    };

    const startEditEvent = (event) => {
        setSelectedEvent(event);
        setEventForm({
            title: event.title,
            description: event.description,
            date: event.date.split('T')[0],
            time: event.time || '',
            location: event.location,
            capacity: event.attendees?.length || 0, // Use attendees length as capacity
            price: event.price || 0
        });
        setIsEditingEvent(true);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const exportToCSV = () => {
        if (events.length === 0) {
            alert("No events to export!");
            return;
        }

        const csvHeaders = ["Event Name,Description,Date,Attendees"];
        const csvRows = events.map(event =>
            `"${event.title}","${event.description}","${formatDate(event.date)}","${event.attendees?.length || 0}"`
        );

        const csvContent = [csvHeaders, ...csvRows].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "events.csv";
        a.click();
        URL.revokeObjectURL(url);
    };


    const handleLogout = () => {
        setAdmin(null);
        localStorage.clear()
        navigate('/')
        axios.defaults.headers.common['Authorization'] = '';
        // Redirect to login would happen here in a real app
    };

    // UI Components
    const SidebarLink = ({ icon, label, tabName }) => (
        <div
            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === tabName ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'} cursor-pointer`}
            onClick={() => {
                setActiveTab(tabName);
                if (tabName === 'events') {
                    setSelectedEvent(null);
                    setIsCreatingEvent(false);
                    setIsEditingEvent(false);
                }
            }}
        >
            {icon}
            {!sidebarCollapsed && <span className="ml-3">{label}</span>}
        </div>
    );

    const StatCard = ({ label, value, icon, color }) => (
        <div className="bg-white rounded-lg shadow-sm p-6 transition-all hover:shadow-md">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-gray-500 text-sm">{label}</p>
                    <h3 className="text-3xl font-bold mt-1">{value}</h3>
                </div>
                <div className={`p-3 ${color} rounded-full`}>
                    {icon}
                </div>
            </div>
        </div>
    );

    const EventRow = ({ event, actions }) => (
        <tr className="border-b last:border-0 hover:bg-gray-50 transition-colors">
            <td className="py-4 pl-4 font-medium">{event.title}</td>
            <td className="py-4">{formatDate(event.date)}</td>
            <td className="py-4">{event.location}</td>
            <td className="py-4">{event.attendees?.length || 0}</td>
            <td className="py-4">{event.attendees?.length || 0}</td>
            <td className="py-4 space-x-2 flex">
                {actions}
            </td>
        </tr>
    );

    const exportRegistrationsToCSV = () => {
        if (registrations.length === 0) {
            alert("No registrations to export!");
            return;
        }

        const csvHeaders = ["Name,Email,Registered Date"];
        const csvRows = registrations.map(reg =>
            `"${reg.user?.email.split("@")[0] || 'N/A'}","${reg.user?.email || 'N/A'}","${formatDate(reg.createdAt)}"`
        );

        const csvContent = [csvHeaders, ...csvRows].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `registrations_${selectedEvent.title.replace(/\s+/g, "_")}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };


    const ActionButton = ({ onClick, icon, color, title }) => (
        <button
            onClick={onClick}
            className={`p-1.5 ${color} rounded-full hover:bg-opacity-20 transition-colors`}
            title={title}
        >
            {icon}
        </button>
    );

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div className={`bg-white shadow-md transition-all duration-300 flex flex-col ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
                <div className="p-4 flex justify-between items-center border-b">
                    {!sidebarCollapsed && <h2 className="text-xl font-bold text-blue-600">CampusHub</h2>}
                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <Menu size={20} />
                    </button>
                </div>

                <div className="py-4 px-3 space-y-1 flex-1">
                    <SidebarLink
                        icon={<PieChart size={20} />}
                        label="Dashboard"
                        tabName="dashboard"
                    />
                    <SidebarLink
                        icon={<Calendar size={20} />}
                        label="Events"
                        tabName="events"
                    />
                </div>

                <div className="border-t p-3">
                    <div
                        className="flex items-center px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                        onClick={handleLogout}
                    >
                        <LogOut size={20} />
                        {!sidebarCollapsed && <span className="ml-3">Logout</span>}
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 overflow-auto">
                {/* Header */}
                <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-10">
                    <div className="flex items-center">
                        {activeTab === 'registrations' && (
                            <button
                                onClick={() => setActiveTab('events')}
                                className="mr-3 text-gray-500 hover:text-gray-700 p-1"
                            >
                                <ChevronLeft size={20} />
                            </button>
                        )}
                        <h1 className="text-xl font-semibold text-gray-800">
                            {activeTab === 'dashboard' && 'Dashboard'}
                            {activeTab === 'events' && (isCreatingEvent ? 'Create Event' : isEditingEvent ? 'Edit Event' : 'Events')}
                            {activeTab === 'registrations' && `Registrations - ${selectedEvent?.title}`}
                        </h1>
                    </div>

                    <div className="flex items-center space-x-4">


                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                                {admin?.username?.charAt(0).toUpperCase() || 'A'}
                            </div>
                            {!sidebarCollapsed && (
                                <span className="text-gray-700 font-medium">
                                    {admin?.username || admin?.email?.split('@')[0] || 'Admin'}
                                </span>
                            )}
                        </div>
                    </div>
                </header>

                {/* Error message */}
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 m-6 rounded flex items-start">
                        <AlertTriangle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">{error}</div>
                        <button className="text-red-500 hover:text-red-700" onClick={() => setError('')}>
                            &times;
                        </button>
                    </div>
                )}

                {/* Main content area */}
                <main className="p-6">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : (
                        <>
                            {/* Dashboard Content */}
                            {activeTab === 'dashboard' && (
                                <>
                                    {/* Stats */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                        <StatCard
                                            label="Total Events"
                                            value={events.length}
                                            icon={<Calendar size={24} className="text-blue-600" />}
                                            color="bg-blue-100"
                                        />
                                        <StatCard
                                            label="Total Attendees"
                                            value={events.reduce((sum, event) => sum + (event.attendees?.length || 0), 0)}
                                            icon={<Users size={24} className="text-green-600" />}
                                            color="bg-green-100"
                                        />
                                        <StatCard
                                            label="Upcoming Events"
                                            value={events.filter(event => new Date(event.date) > new Date()).length}
                                            icon={<PieChart size={24} className="text-purple-600" />}
                                            color="bg-purple-100"
                                        />
                                    </div>
                                    <div className="w-full">
                                        {/* Recent events */}
                                        <div className="lg:col-span-2">
                                            <div className="bg-white rounded-lg shadow-sm h-full">
                                                {/* Header Section */}
                                                <div className="p-6 border-b flex justify-between items-center">
                                                    <h2 className="text-lg font-semibold">Recent Events</h2>
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={exportToCSV}
                                                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-700 rounded-lg shadow-md hover:from-green-600 hover:to-green-800 transform hover:scale-105 transition-all"
                                                        >
                                                            <Download size={16} />
                                                            Export CSV
                                                        </button>
                                                        <button
                                                            onClick={() => setActiveTab('events')}
                                                            className="text-blue-500 text-sm hover:underline"
                                                        >
                                                            View All
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Table Section */}
                                                <div className="p-5 overflow-x-auto">
                                                    {events.length > 0 ? (
                                                        <table className="w-full">
                                                            <thead>
                                                                <tr className="text-left text-gray-500 border-b">
                                                                    <th className="pb-3 px-5">Event</th>
                                                                    <th className="pb-3 px-5">Description</th>
                                                                    <th className="pb-3 px-5">Date & Time</th>
                                                                    <th className="pb-3 px-5">Location</th>
                                                                    <th className="pb-3 px-5 text-center">Attendees</th>
                                                                    <th className="pb-3 px-5 w-20 text-center">View</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {events.map(event => (
                                                                    <tr key={event._id} className="border-b last:border-0 hover:bg-gray-50 transition">
                                                                        {/* Event Title */}
                                                                        <td className="px-5 py-3 font-semibold text-gray-800 whitespace-nowrap">{event.title}</td>

                                                                        {/* Description */}
                                                                        <td className="px-5 py-3 text-gray-600 truncate max-w-xs">{event.description}</td>

                                                                        {/* Date & Time */}
                                                                        <td className="px-5 py-3 text-gray-700">
                                                                            {formatDate(event.date)}
                                                                            <br />
                                                                            <span className="text-sm text-gray-500">{event.time}</span>
                                                                        </td>

                                                                        {/* Location */}
                                                                        <td className="px-5 py-3 text-gray-700">{event.location}</td>

                                                                        {/* Attendees Count */}
                                                                        <td className="px-5 py-3 text-gray-700 text-center">{event.attendees?.length || 0}</td>

                                                                        {/* View Registrations Button */}
                                                                        <td className="px-5 py-3 text-center">
                                                                            <ActionButton
                                                                                onClick={() => fetchEventRegistrations(event._id)}
                                                                                icon={<Eye size={18} />}
                                                                                color="text-blue-500 hover:text-blue-700 transition"
                                                                                title="View Registrations"
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    ) : (
                                                        <div className="text-center py-8 text-gray-500">
                                                            No events found.
                                                            <button
                                                                className="text-blue-500 hover:underline"
                                                                onClick={() => { setActiveTab('events'); setIsCreatingEvent(true); }}
                                                            >
                                                                Create your first event?
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                </>
                            )}

                            {/* Events List */}
                            {activeTab === 'events' && !isCreatingEvent && !isEditingEvent && (
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-lg font-semibold">Manage Events</h2>
                                        <button
                                            onClick={() => setIsCreatingEvent(true)}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                                        >
                                            <Plus size={18} className="mr-1" /> Create New Event
                                        </button>
                                    </div>

                                    <div className="overflow-x-auto">
                                        {events.length > 0 ? (
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="text-left text-gray-500 border-b">
                                                        <th className="pb-3 pl-4">Event Name</th>
                                                        <th className="pb-3">Date</th>
                                                        <th className="pb-3">Location</th>
                                                        <th className="pb-3">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {events.map(event => (
                                                        <EventRow
                                                            key={event._id}
                                                            event={event}
                                                            actions={
                                                                <>
                                                                    <ActionButton
                                                                        onClick={() => fetchEventRegistrations(event._id)}
                                                                        icon={<Eye size={18} />}
                                                                        color="text-blue-500"
                                                                        title="View Registrations"
                                                                    />
                                                                    <ActionButton
                                                                        onClick={() => startEditEvent(event)}
                                                                        icon={<Edit size={18} />}
                                                                        color="text-green-500"
                                                                        title="Edit Event"
                                                                    />
                                                                    <ActionButton
                                                                        onClick={() => handleDeleteEvent(event._id)}
                                                                        icon={<Trash2 size={18} />}
                                                                        color="text-red-500"
                                                                        title="Delete Event"
                                                                    />
                                                                </>
                                                            }
                                                        />
                                                    ))}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <div className="text-center py-8 text-gray-500">
                                                No events found. Create your first event by clicking the button above.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Create/Edit Event Form */}
                            {activeTab === 'events' && (isCreatingEvent || isEditingEvent) && (
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <form onSubmit={isCreatingEvent ? handleCreateEvent : handleUpdateEvent}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                                                <input
                                                    type="text"
                                                    value={eventForm.title}
                                                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                                <input
                                                    type="text"
                                                    value={eventForm.location}
                                                    onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                                <input
                                                    type="date"
                                                    value={eventForm.date}
                                                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                                                <input
                                                    type="time"
                                                    value={eventForm.time}
                                                    onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                    required
                                                />
                                            </div>

                                        </div>
                                        <div className="mt-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                            <textarea
                                                value={eventForm.description}
                                                onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                rows="4"
                                                required
                                            ></textarea>
                                        </div>
                                        <div className="mt-6 flex justify-end space-x-4">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    isCreatingEvent ? setIsCreatingEvent(false) : setIsEditingEvent(false);
                                                    setSelectedEvent(null);
                                                }}
                                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                {isCreatingEvent ? 'Create Event' : 'Update Event'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                            {/* Registrations */}
                            {activeTab === 'registrations' && selectedEvent && (
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <div className="mb-6">
                                        <div className="mb-4 flex justify-between items-center">
                                            <div>
                                                <h3 className="text-lg font-medium">{selectedEvent.title}</h3>
                                                <p className="text-gray-500">{formatDate(selectedEvent.date)} | {selectedEvent.location}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={exportRegistrationsToCSV}
                                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-full shadow-md hover:bg-green-700 hover:shadow-lg transition duration-300"
                                                >
                                                    <Download size={16} /> Export CSV
                                                </button>
                                            </div>

                                        </div>

                                        <div className="overflow-x-auto">
                                            {registrations.length > 0 ? (
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="text-left text-gray-500 border-b">
                                                            <th className="pb-3 pl-4">Name</th>
                                                            <th className="pb-3">Email</th>
                                                            <th className="pb-3">Registered Date</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {registrations.map(registration => (
                                                            <tr key={registration._id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                                                                <td className="py-4 pl-4">{registration.user?.email.split("@")[0] || 'N/A'}</td>
                                                                <td className="py-4">{registration.user?.email || 'N/A'}</td>
                                                                <td className="py-4">{formatDate(registration.createdAt)}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            ) : (
                                                <div className="text-center py-8 text-gray-500">
                                                    No registrations found for this event.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}



                        </>
                    )}
                </main>
            </div>
        </div>
    );
}