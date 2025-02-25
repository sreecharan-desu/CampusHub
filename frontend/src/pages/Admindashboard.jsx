/* eslint-disable react/prop-types */
// src/components/admin/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { adminState } from "../state/adminAtom";
import { Menu, LogOut, ChevronLeft, AlertTriangle, CheckCircle, XCircle, X } from 'lucide-react';
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
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

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
    }, [navigate]);

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
        setLoading(true);
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
        } finally {
            setLoading(false);
        }
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('https://campushub-api.vercel.app/admin/create-event', eventForm);
            if (response.data.success) {
                setEvents([...events, response.data.event]);
                setIsCreatingEvent(false);
                resetEventForm();
                showToast('Event created successfully', 'success');
            }
        } catch (error) {
            console.log(error);
            handleError('Failed to create event');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateEvent = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.put(`https://campushub-api.vercel.app/admin/edit-event/${selectedEvent._id}`, eventForm);
            if (response.data.success) {
                setEvents(events.map(event => event._id === selectedEvent._id ? response.data.event : event));
                setIsEditingEvent(false);
                setSelectedEvent(null);
                showToast(`Event "${response.data.event.title}" updated successfully`, 'success');
            }
        } catch (error) {
            console.log(error);
            handleError('Failed to update event');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteEvent = async (eventId) => {
        if (!confirm('Are you sure you want to delete this event?')) return;

        setLoading(true);
        try {
            const response = await axios.delete(`https://campushub-api.vercel.app/admin/delete-event/${eventId}`);
            if (response.data.success) {
                setEvents(events.filter(event => event._id !== eventId));
                showToast('Event deleted successfully', 'success');
            }
        } catch (error) {
            console.log(error);
            handleError('Failed to delete event');
        } finally {
            setLoading(false);
        }
    };

    // Helper Functions
    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 5000);
    };

    const handleError = (message) => {
        setError(message);
        console.error(message);
        showToast(message, 'error');
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
            capacity: event.attendees?.length || 0,
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
            showToast("No events to export!", "warning");
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
        
        showToast("Events exported successfully", "success");
    };

    const exportRegistrationsToCSV = () => {
        if (registrations.length === 0) {
            showToast("No registrations to export!", "warning");
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
        
        showToast("Registrations exported successfully", "success");
    };

    const handleLogout = () => {
        setAdmin(null);
        localStorage.clear();
        navigate('/');
        axios.defaults.headers.common['Authorization'] = '';
        showToast("Logged out successfully", "success");
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar
                sidebarCollapsed={sidebarCollapsed}
                setSidebarCollapsed={setSidebarCollapsed}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                handleLogout={handleLogout}
                setSelectedEvent={setSelectedEvent}
                setIsCreatingEvent={setIsCreatingEvent}
                setIsEditingEvent={setIsEditingEvent}
            />

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

                {/* Toast Notifications */}
                {toast.show && (
                    <Toast 
                        message={toast.message} 
                        type={toast.type} 
                        onClose={() => setToast({ show: false, message: '', type: '' })} 
                    />
                )}

                {/* Main content area */}
                <main className="p-6">
                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            {/* Dashboard Content */}
                            {activeTab === 'dashboard' && (
                                <DashboardView 
                                    events={events}
                                    formatDate={formatDate}
                                    exportToCSV={exportToCSV}
                                    setActiveTab={setActiveTab}
                                    fetchEventRegistrations={fetchEventRegistrations}
                                    setIsCreatingEvent={setIsCreatingEvent}
                                />
                            )}

                            {/* Events List */}
                            {activeTab === 'events' && !isCreatingEvent && !isEditingEvent && (
                                <EventsView 
                                    events={events}
                                    setIsCreatingEvent={setIsCreatingEvent}
                                    fetchEventRegistrations={fetchEventRegistrations}
                                    startEditEvent={startEditEvent}
                                    handleDeleteEvent={handleDeleteEvent}
                                    formatDate={formatDate}
                                />
                            )}

                            {/* Create/Edit Event Form */}
                            {activeTab === 'events' && (isCreatingEvent || isEditingEvent) && (
                                <EventForm 
                                    eventForm={eventForm}
                                    setEventForm={setEventForm}
                                    isCreatingEvent={isCreatingEvent}
                                    setIsCreatingEvent={setIsCreatingEvent}
                                    isEditingEvent={isEditingEvent}
                                    setIsEditingEvent={setIsEditingEvent}
                                    handleCreateEvent={handleCreateEvent}
                                    handleUpdateEvent={handleUpdateEvent}
                                    setSelectedEvent={setSelectedEvent}
                                />
                            )}

                            {/* Registrations */}
                            {activeTab === 'registrations' && selectedEvent && (
                                <RegistrationsView 
                                    selectedEvent={selectedEvent}
                                    registrations={registrations}
                                    formatDate={formatDate}
                                    exportRegistrationsToCSV={exportRegistrationsToCSV}
                                />
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}

// src/components/admin/Sidebar.jsx
import { Calendar, PieChart } from 'lucide-react';

export function Sidebar({ 
    sidebarCollapsed, 
    setSidebarCollapsed, 
    activeTab, 
    setActiveTab, 
    handleLogout,
    setSelectedEvent,
    setIsCreatingEvent,
    setIsEditingEvent
}) {
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

    return (
        <div className={`bg-white shadow-md transition-all duration-300 flex flex-col ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
            <div className="p-4 flex justify-between items-center border-b">
                {!sidebarCollapsed && <h2 className="text-xl font-bold text-blue-600">CampusHub</h2>}
                <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
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
    );
}

// src/components/admin/DashboardView.jsx
import {  Users, Eye, Download } from 'lucide-react';

export function DashboardView({ 
    events, 
    formatDate, 
    exportToCSV, 
    setActiveTab, 
    fetchEventRegistrations,
    setIsCreatingEvent
}) {
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
                                        className="text-blue-500 hover:underline ml-2"
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
    );
}

// src/components/admin/EventsView.jsx
import { Plus, Edit, Trash2 } from 'lucide-react';

export function EventsView({
    events,
    setIsCreatingEvent,
    fetchEventRegistrations,
    startEditEvent,
    handleDeleteEvent,
    formatDate
}) {
    const EventRow = ({ event, actions }) => (
        <tr className="border-b last:border-0 hover:bg-gray-50 transition-colors">
            <td className="py-4 pl-4 font-medium">{event.title}</td>
            <td className="py-4">{formatDate(event.date)}</td>
            <td className="py-4">{event.location}</td>
            <td className="py-4">{event.attendees?.length || 0}</td>
            <td className="py-4 space-x-2 flex">
                {actions}
            </td>
        </tr>
    );

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
                                <th className="pb-3">Attendees</th>
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
    );
}

// src/components/admin/RegistrationsView.jsx

export  function RegistrationsView({ 
    selectedEvent, 
    registrations, 
    formatDate, 
    exportRegistrationsToCSV 
}) {
    return (
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
    );
}

export  function EventForm({
    eventForm,
    setEventForm,
    isCreatingEvent,
    setIsCreatingEvent,
    isEditingEvent,
    setIsEditingEvent,
    handleCreateEvent,
    handleUpdateEvent,
    setSelectedEvent
}) {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <form onSubmit={isCreatingEvent ? handleCreateEvent : handleUpdateEvent}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Event Title */}
                    <div className="col-span-2">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Event Title *
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            required
                            value={eventForm.title}
                            onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter event title"
                        />
                    </div>

                    {/* Description */}
                    <div className="col-span-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description *
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            required
                            value={eventForm.description}
                            onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                            rows="4"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter event description"
                        ></textarea>
                    </div>

                    {/* Date */}
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                            Date *
                        </label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            required
                            value={eventForm.date}
                            onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Time */}
                    <div>
                        <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                            Time *
                        </label>
                        <input
                            type="time"
                            id="time"
                            name="time"
                            required
                            value={eventForm.time}
                            onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                            Location *
                        </label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            required
                            value={eventForm.location}
                            onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter event location"
                        />
                    </div>

                    {/* Capacity */}
                    <div>
                        <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
                            Capacity *
                        </label>
                        <input
                            type="number"
                            id="capacity"
                            name="capacity"
                            required
                            min="1"
                            value={eventForm.capacity}
                            onChange={(e) => setEventForm({ ...eventForm, capacity: parseInt(e.target.value) })}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Maximum number of attendees"
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                            Price ($)
                        </label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            min="0"
                            step="0.01"
                            value={eventForm.price}
                            onChange={(e) => setEventForm({ ...eventForm, price: parseFloat(e.target.value) })}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter event price (0 for free events)"
                        />
                    </div>
                </div>

                <div className="mt-8 flex justify-end space-x-3">
                    <button
                        type="button"
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                        onClick={() => {
                            if (isCreatingEvent) setIsCreatingEvent(false);
                            if (isEditingEvent) {
                                setIsEditingEvent(false);
                                setSelectedEvent(null);
                            }
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        {isCreatingEvent ? 'Create Event' : 'Update Event'}
                    </button>
                </div>
            </form>
        </div>
    );
}


export  function LoadingSpinner() {
    return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading...</span>
        </div>
    );
}


export function Toast({ message, type = 'success', onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle size={20} className="text-green-500" />;
            case 'warning':
                return <AlertTriangle size={20} className="text-yellow-500" />;
            case 'error':
                return <XCircle size={20} className="text-red-500" />;
            default:
                return <CheckCircle size={20} className="text-green-500" />;
        }
    };

    const getBackgroundColor = () => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200';
            case 'error':
                return 'bg-red-50 border-red-200';
            default:
                return 'bg-green-50 border-green-200';
        }
    };

    return (
        <div className={`fixed top-5 right-5 z-50 flex items-center p-4 rounded-lg shadow-md border ${getBackgroundColor()} animate-slideIn`}>
            <div className="flex items-center">
                {getIcon()}
                <div className="ml-3 mr-6">
                    <p className="text-sm font-medium text-gray-800">{message}</p>
                </div>
            </div>
            <button
                onClick={onClose}
                className="ml-auto text-gray-400 hover:text-gray-500 focus:outline-none"
                aria-label="Close"
            >
                <X size={16} />
            </button>
        </div>
    );
}