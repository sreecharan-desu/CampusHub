import { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { adminState } from "../state/adminAtom";
import { Bell, Calendar, ChevronDown, LogOut, Menu, PieChart, Settings, Users, Plus, Edit, Trash2, Eye } from 'lucide-react';
import axios from 'axios'; // Assuming axios is installed

export default function AdminDashboard(){
    const [admin, setAdmin] = useRecoilState(adminState);
    const [events, setEvents] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [collapsed, setCollapsed] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [notifications, setNotifications] = useState([]);
    const [isCreatingEvent, setIsCreatingEvent] = useState(false);
    const [isEditingEvent, setIsEditingEvent] = useState(false);
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

    // Setup axios defaults
    useEffect(() => {
        if (admin?.token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${admin.token}`;
        }
    }, [admin]);

    // Fetch events data
    const fetchEvents = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`https://campushub-api.vercel.app/admin/events`);
            if (response.data.success) {
                setEvents(response.data.events);
            }
        } catch (error) {
            setError('Failed to fetch events');
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch admin profile
    const fetchProfile = async () => {
        try {
            const response = await axios.get('https://campushub-api.vercel.app/admin/profile');
            if (response.data.success) {
                setAdmin(prevState => ({
                    ...prevState,
                    ...response.data.admin
                }));
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    // Fetch event registrations
    const fetchEventRegistrations = async (eventId) => {
        try {
            const response = await axios.get(`https://campushub-api.vercel.app/admin/event/${eventId}/registrations`);
            if (response.data.success) {
                setRegistrations(response.data.registrations);
                setSelectedEvent(events.find(event => event._id === eventId));
                setActiveTab('registrations');
            }
        } catch (error) {
            setError('Failed to fetch registrations');
            console.error('Error fetching registrations:', error);
        }
    };

    // Initial data fetch
    useEffect(() => {
        fetchProfile();
        fetchEvents();
    }, []);

    // Handle logout
    const handleLogout = () => {
        setAdmin(null);
        // Clear token
        axios.defaults.headers.common['Authorization'] = '';
        // In a real app, you would redirect to login
    };

    // Handle event creation
    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://campushub-api.vercel.app/admin/create-event', eventForm);
            if (response.data.success) {
                setEvents([...events, response.data.event]);
                setIsCreatingEvent(false);
                setEventForm({
                    title: '',
                    description: '',
                    date: '',
                    time: '',
                    location: '',
                    capacity: 0,
                    price: 0
                });
                // Add notification
                setNotifications([
                    { id: Date.now(), text: `Event "${response.data.event.title}" created successfully`, time: 'Just now' },
                    ...notifications
                ]);
            }
        } catch (error) {
            setError('Failed to create event');
            console.error('Error creating event:', error);
        }
    };

    // Handle event update
    const handleUpdateEvent = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`https://campushub-api.vercel.app/admin/edit-event/${selectedEvent._id}`, eventForm);
            if (response.data.success) {
                setEvents(events.map(event =>
                    event._id === selectedEvent._id ? response.data.event : event
                ));
                setIsEditingEvent(false);
                setSelectedEvent(null);
                // Add notification
                setNotifications([
                    { id: Date.now(), text: `Event "${response.data.event.title}" updated successfully`, time: 'Just now' },
                    ...notifications
                ]);
            }
        } catch (error) {
            setError('Failed to update event');
            console.error('Error updating event:', error);
        }
    };

    // Handle event deletion
    const handleDeleteEvent = async (eventId) => {
        if (!window.confirm('Are you sure you want to delete this event?')) return;

        try {
            const response = await axios.delete(`https://campushub-api.vercel.app/admin/delete-event/${eventId}`);
            if (response.data.success) {
                setEvents(events.filter(event => event._id !== eventId));
                // Add notification
                setNotifications([
                    { id: Date.now(), text: 'Event deleted successfully', time: 'Just now' },
                    ...notifications
                ]);
            }
        } catch (error) {
            setError('Failed to delete event');
            console.error('Error deleting event:', error);
        }
    };

    // Edit event
    const startEditEvent = (event) => {
        setSelectedEvent(event);
        setEventForm({
            title: event.title,
            description: event.description,
            date: event.date.split('T')[0],
            time: event.time || '',
            location: event.location,
            capacity: event.capacity,
            price: event.price
        });
        setIsEditingEvent(true);
    };

    // Format date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div className={`bg-white shadow-lg transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
                <div className="p-4 flex justify-between items-center border-b">
                    {!collapsed && <h2 className="text-xl font-bold text-blue-600">EventAdmin</h2>}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="p-2 rounded-lg hover:bg-gray-100"
                    >
                        <Menu size={20} />
                    </button>
                </div>
                <div className="py-4">
                    <div
                        className={`flex items-center px-4 py-3 ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'} hover:bg-blue-50 hover:text-blue-600 cursor-pointer`}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        <PieChart size={20} />
                        {!collapsed && <span className="ml-3">Dashboard</span>}
                    </div>
                    <div
                        className={`flex items-center px-4 py-3 ${activeTab === 'events' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'} hover:bg-blue-50 hover:text-blue-600 cursor-pointer`}
                        onClick={() => { setActiveTab('events'); setSelectedEvent(null); }}
                    >
                        <Calendar size={20} />
                        {!collapsed && <span className="ml-3">Events</span>}
                    </div>
                    <div
                        className={`flex items-center px-4 py-3 ${activeTab === 'settings' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'} hover:bg-blue-50 hover:text-blue-600 cursor-pointer`}
                        onClick={() => setActiveTab('settings')}
                    >
                        <Settings size={20} />
                        {!collapsed && <span className="ml-3">Settings</span>}
                    </div>
                </div>
                <div className="absolute bottom-0 w-full border-t">
                    <div
                        className="flex items-center px-4 py-3 text-red-500 hover:bg-red-50 cursor-pointer"
                        onClick={handleLogout}
                    >
                        <LogOut size={20} />
                        {!collapsed && <span className="ml-3">Logout</span>}
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 overflow-auto">
                {/* Header */}
                <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-10">
                    <h1 className="text-2xl font-semibold text-gray-800">
                        {activeTab === 'dashboard' && 'Dashboard'}
                        {activeTab === 'events' && (isCreatingEvent ? 'Create Event' : isEditingEvent ? 'Edit Event' : 'Events')}
                        {activeTab === 'registrations' && `Registrations for ${selectedEvent?.title}`}
                        {activeTab === 'settings' && 'Settings'}
                    </h1>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                                <Bell size={20} />
                                {notifications.length > 0 && (
                                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                        {notifications.length}
                                    </span>
                                )}
                            </button>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                                {admin?.adminName?.charAt(0).toUpperCase() || 'A'}
                            </div>
                            {!collapsed && (
                                <>
                                    <span className="text-gray-700 font-medium">{admin?.adminName || 'Admin User'}</span>
                                    <ChevronDown size={16} className="text-gray-500" />
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Error message */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mx-6 mt-4 relative">
                        <span className="block sm:inline">{error}</span>
                        <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError('')}>
                            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <title>Close</title>
                                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                            </svg>
                        </span>
                    </div>
                )}

                {/* Dashboard content */}
                <main className="p-6">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : (
                        <>
                            {/* Dashboard */}
                            {activeTab === 'dashboard' && (
                                <>
                                    {/* Stats */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                        <div className="bg-white rounded-lg shadow p-6">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="text-gray-500 text-sm">Total Events</p>
                                                    <h3 className="text-3xl font-bold">{events.length}</h3>
                                                </div>
                                                <div className="p-3 bg-blue-100 rounded-full">
                                                    <Calendar size={24} className="text-blue-600" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-white rounded-lg shadow p-6">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="text-gray-500 text-sm">Total Attendees</p>
                                                    <h3 className="text-3xl font-bold">
                                                        {events.reduce((sum, event) => sum + (event.attendees?.length || 0), 0)}
                                                    </h3>
                                                </div>
                                                <div className="p-3 bg-green-100 rounded-full">
                                                    <Users size={24} className="text-green-600" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-white rounded-lg shadow p-6">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="text-gray-500 text-sm">Upcoming Events</p>
                                                    <h3 className="text-3xl font-bold">
                                                        {events.filter(event => new Date(event.date) > new Date()).length}
                                                    </h3>
                                                </div>
                                                <div className="p-3 bg-purple-100 rounded-full">
                                                    <PieChart size={24} className="text-purple-600" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Recent events */}
                                    <div className="bg-white rounded-lg shadow mb-6">
                                        <div className="p-6 border-b flex justify-between items-center">
                                            <h2 className="text-lg font-semibold">Recent Events</h2>
                                            <button
                                                onClick={() => setActiveTab('events')}
                                                className="text-blue-500 text-sm"
                                            >
                                                View All
                                            </button>
                                        </div>
                                        <div className="p-6">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="text-left text-gray-500 border-b">
                                                        <th className="pb-3">Event Name</th>
                                                        <th className="pb-3">Date</th>
                                                        <th className="pb-3">Attendees</th>
                                                        <th className="pb-3">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {events.slice(0, 5).map(event => (
                                                        <tr key={event._id} className="border-b last:border-0">
                                                            <td className="py-4 font-medium">{event.title}</td>
                                                            <td className="py-4">{formatDate(event.date)}</td>
                                                            <td className="py-4">{event.attendees?.length || 0}</td>
                                                            <td className="py-4">
                                                                <button
                                                                    onClick={() => fetchEventRegistrations(event._id)}
                                                                    className="mr-2 text-blue-500"
                                                                >
                                                                    <Eye size={18} />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {events.length === 0 && (
                                                        <tr>
                                                            <td colSpan="4" className="py-4 text-center text-gray-500">
                                                                No events found
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Notifications */}
                                    <div className="bg-white rounded-lg shadow">
                                        <div className="p-6 border-b">
                                            <h2 className="text-lg font-semibold">Recent Notifications</h2>
                                        </div>
                                        <div className="p-6">
                                            {notifications.length > 0 ? (
                                                notifications.map(notification => (
                                                    <div key={notification.id} className="py-3 border-b last:border-0">
                                                        <p className="font-medium">{notification.text}</p>
                                                        <p className="text-sm text-gray-500">{notification.time}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-gray-500 text-center">No notifications</p>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Events Management */}
                            {activeTab === 'events' && !isCreatingEvent && !isEditingEvent && (
                                <div className="bg-white rounded-lg shadow p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-lg font-semibold">Manage Events</h2>
                                        <button
                                            onClick={() => setIsCreatingEvent(true)}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                                        >
                                            <Plus size={18} className="mr-1" /> Create New Event
                                        </button>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="text-left text-gray-500 border-b">
                                                    <th className="pb-3 pl-2">Event Name</th>
                                                    <th className="pb-3">Date</th>
                                                    <th className="pb-3">Location</th>
                                                    <th className="pb-3">Capacity</th>
                                                    <th className="pb-3">Attendees</th>
                                                    <th className="pb-3">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {events.map(event => (
                                                    <tr key={event._id} className="border-b last:border-0 hover:bg-gray-50">
                                                        <td className="py-4 pl-2 font-medium">{event.title}</td>
                                                        <td className="py-4">{formatDate(event.date)}</td>
                                                        <td className="py-4">{event.location}</td>
                                                        <td className="py-4">{event.capacity}</td>
                                                        <td className="py-4">{event.attendees?.length || 0}</td>
                                                        <td className="py-4 space-x-2 flex">
                                                            <button
                                                                onClick={() => fetchEventRegistrations(event._id)}
                                                                className="p-1 text-blue-500 hover:bg-blue-100 rounded"
                                                                title="View Registrations"
                                                            >
                                                                <Eye size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => startEditEvent(event)}
                                                                className="p-1 text-green-500 hover:bg-green-100 rounded"
                                                                title="Edit Event"
                                                            >
                                                                <Edit size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteEvent(event._id)}
                                                                className="p-1 text-red-500 hover:bg-red-100 rounded"
                                                                title="Delete Event"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {events.length === 0 && (
                                                    <tr>
                                                        <td colSpan="6" className="py-4 text-center text-gray-500">
                                                            No events found
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Create Event Form */}
                            {activeTab === 'events' && isCreatingEvent && (
                                <div className="bg-white rounded-lg shadow p-6">
                                    <form onSubmit={handleCreateEvent}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                                                <input
                                                    type="text"
                                                    value={eventForm.title}
                                                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                                                    className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                                <input
                                                    type="text"
                                                    value={eventForm.location}
                                                    onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                                                    className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                                <input
                                                    type="date"
                                                    value={eventForm.date}
                                                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                                                    className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                                                <input
                                                    type="time"
                                                    value={eventForm.time}
                                                    onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                                                    className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                                                <input
                                                    type="number"
                                                    value={eventForm.capacity}
                                                    onChange={(e) => setEventForm({ ...eventForm, capacity: parseInt(e.target.value) })}
                                                    className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                    min="1"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                                <input
                                                    type="number"
                                                    value={eventForm.price}
                                                    onChange={(e) => setEventForm({ ...eventForm, price: parseFloat(e.target.value) })}
                                                    className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                    min="0"
                                                    step="0.01"
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                            <textarea
                                                value={eventForm.description}
                                                onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                                                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                                rows="4"
                                                required
                                            ></textarea>
                                        </div>
                                        <div className="mt-6 flex justify-end space-x-4">
                                            <button
                                                type="button"
                                                onClick={() => setIsCreatingEvent(false)}
                                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                            >
                                                Create Event
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* Edit Event Form */}
                            {activeTab === 'events' && isEditingEvent && (
                                <div className="bg-white rounded-lg shadow p-6">
                                    <form onSubmit={handleUpdateEvent}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                                                <input
                                                    type="text"
                                                    value={eventForm.title}
                                                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                                                    className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                                <input
                                                    type="text"
                                                    value={eventForm.location}
                                                    onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                                                    className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                                <input
                                                    type="date"
                                                    value={eventForm.date}
                                                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                                                    className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                                                <input
                                                    type="time"
                                                    value={eventForm.time}
                                                    onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                                                    className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                                                <input
                                                    type="number"
                                                    value={eventForm.capacity}
                                                    onChange={(e) => setEventForm({ ...eventForm, capacity: parseInt(e.target.value) })}
                                                    className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                    min="1"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                                <input
                                                    type="number"
                                                    value={eventForm.price}
                                                    onChange={(e) => setEventForm({ ...eventForm, price: parseFloat(e.target.value) })}
                                                    className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                    min="0"
                                                    step="0.01"
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                            <textarea
                                                value={eventForm.description}
                                                onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                                                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                                rows="4"
                                                required
                                            ></textarea>
                                        </div>
                                        <div className="mt-6 flex justify-end space-x-4">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsEditingEvent(false);
                                                    setSelectedEvent(null);
                                                }}
                                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                            >
                                                Update Event
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* Registrations */}
                            {activeTab === 'registrations' && selectedEvent && (
                                <div className="bg-white rounded-lg shadow p-6">
                                    <div className="mb-6">
                                        <button
                                            onClick={() => setActiveTab('events')}
                                            className="text-blue-500 flex items-center"
                                        >
                                            <ChevronDown className="rotate-90 mr-1" size={16} /> Back to Events
                                        </button>
                                    </div>

                                    <div className="mb-4">
                                        <h3 className="text-lg font-medium">{selectedEvent.title}</h3>
                                        <p className="text-gray-500">{formatDate(selectedEvent.date)} | {selectedEvent.location}</p>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="text-left text-gray-500 border-b">
                                                    <th className="pb-3">Name</th>
                                                    <th className="pb-3">Email</th>
                                                    <th className="pb-3">Registration Date</th>
                                                    <th className="pb-3">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {registrations.map(registration => (
                                                    <tr key={registration._id} className="border-b last:border-0 hover:bg-gray-50">
                                                        <td className="py-4">{registration.user.name}</td>
                                                        <td className="py-4">{registration.user.email}</td>
                                                        <td className="py-4">{formatDate(registration.registrationDate)}</td>
                                                        <td className="py-4">
                                                            <span className={`px-2 py-1 text-sm rounded-full ${registration.status === 'confirmed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}}>
{registration.status`}>
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {registrations.length === 0 && (
                                                    <tr>
                                                        <td colSpan="4" className="py-4 text-center text-gray-500">
                                                            No registrations found
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Settings */}
                            {activeTab === 'settings' && (
                                <div className="bg-white rounded-lg shadow p-6">
                                    <h2 className="text-lg font-semibold mb-6">Settings</h2>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Admin Name</label>
                                            <input
                                                type="text"
                                                value={admin?.adminName || ''}
                                                onChange={(e) => setAdmin(prevState => ({ ...prevState, adminName: e.target.value }))}
                                                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                            <input
                                                type="email"
                                                value={admin?.email || ''}
                                                onChange={(e) => setAdmin(prevState => ({ ...prevState, email: e.target.value }))}
                                                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Change Password</label>
                                            <input
                                                type="password"
                                                placeholder="New Password"
                                                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                            >
                                                Save Changes
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>);
}