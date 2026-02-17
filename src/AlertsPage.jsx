import React, { useState, useEffect } from 'react';

const AlertsPage = () => {
    const [alerts, setAlerts] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // For filtering

    useEffect(() => {
        fetch('http://localhost:8000/alerts')
            .then(res => res.json())
            .then(data => setAlerts(data));
    }, []);

    // Logic for Filtering by topic
    const filteredAlerts = alerts.filter(alert => 
        alert.topic.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Triggered Alerts</h1>
            
            {/* Filter Input */}
            <input 
                type="text" 
                placeholder="Filter by topic (e.g. kitchen)..." 
                className="border p-2 mb-4 rounded w-full md:w-1/3"
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="w-full text-left">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3">Topic</th>
                            <th className="p-3">Violated Parameter</th>
                            <th className="p-3">Actual Value</th>
                            <th className="p-3">Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAlerts.map(alert => (
                            <tr key={alert.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-medium">{alert.topic}</td>
                                <td className="p-3">
                                    {/* Highlighting violated parameter */}
                                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-sm font-bold">
                                        {alert.violated_key}
                                    </span>
                                </td>
                                <td className="p-3 text-red-600 font-semibold">{alert.actual_value}</td>
                                <td className="p-3 text-gray-500">{new Date(alert.created_at).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AlertsPage;