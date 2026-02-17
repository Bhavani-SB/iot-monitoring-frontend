import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, AlertTriangle, Database, LayoutDashboard, Thermometer, Droplets, Zap, Clock, CheckCircle, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE = "http://127.0.0.1:8000";

function App() {
  const [data, setData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [view, setView] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTopic, setFilterTopic] = useState("All");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const fetchData = async () => {
    try {
      const sRes = await axios.get(`${API_BASE}/data`);
      const aRes = await axios.get(`${API_BASE}/alerts`);
      
      // Popup Alert Logic
      if (aRes.data.length > alerts.length && alerts.length > 0) {
        const newAlert = aRes.data[0];
        toast.error(`⚠️ ALERT: ${newAlert.topic} - ${newAlert.violated_key} exceeded!`, {
          position: "top-right",
          autoClose: 5000,
        });
      }

      setData(sRes.data);
      setAlerts(aRes.data);
    } catch (err) {
      console.error("Backend offline!");
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [alerts.length]);

  const latest = data[0] || {};

  // Topic-wise Filter Logic
  const uniqueTopics = ["All", ...new Set(data.map(item => item.topic))];
  const filteredData = data.filter(item => 
    (filterTopic === "All" || item.topic === filterTopic) &&
    item.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const currentRecords = filteredData.slice(firstIndex, lastIndex);
  const npage = Math.ceil(filteredData.length / recordsPerPage);

  // Acknowledge Function
  const handleAcknowledge = (id) => {
    setAlerts(alerts.filter(a => a.id !== id));
    toast.success("Alert acknowledged and cleared!");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
      <ToastContainer />
      
      {/* Sidebar */}
      <nav className="w-64 bg-slate-900 text-white p-6 fixed h-full shadow-2xl z-10">
        <h2 className="text-2xl font-bold mb-10 flex items-center gap-2 text-blue-400">
          <Activity size={28} /> IoT Pro
        </h2>
        <div className="space-y-2">
          <button onClick={() => setView('dashboard')} className={`w-full flex items-center gap-3 p-3 rounded-lg ${view === 'dashboard' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}>
            <LayoutDashboard size={20}/> Dashboard
          </button>
          <button onClick={() => setView('alerts')} className={`w-full flex items-center gap-3 p-3 rounded-lg ${view === 'alerts' ? 'bg-red-600' : 'hover:bg-slate-800'}`}>
            <AlertTriangle size={20}/> Alerts ({alerts.length})
          </button>
          <button onClick={() => setView('raw')} className={`w-full flex items-center gap-3 p-3 rounded-lg ${view === 'raw' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}>
            <Database size={20}/> Raw Logs
          </button>
        </div>
      </nav>

      <main className="ml-64 flex-1 p-8">
        {/* VIEW 1: DASHBOARD */}
        {view === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <h1 className="text-3xl font-extrabold text-slate-800">System Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`p-6 rounded-2xl shadow-lg border transition-all ${latest.temperature > 40 ? 'bg-red-500 text-white animate-pulse' : 'bg-white'}`}>
                <p className="text-sm opacity-80 uppercase font-bold text-slate-500">Temperature</p>
                <p className="text-4xl font-black">{latest.temperature?.toFixed(1) || '--'}°C</p>
              </div>
              <div className={`p-6 rounded-2xl shadow-lg border transition-all ${latest.humidity > 80 ? 'bg-red-500 text-white animate-pulse' : 'bg-white'}`}>
                <p className="text-sm opacity-80 uppercase font-bold text-slate-500">Humidity</p>
                <p className="text-4xl font-black">{latest.humidity?.toFixed(1) || '--'}%</p>
              </div>
              <div className="bg-blue-600 p-6 rounded-2xl shadow-lg text-white">
                <p className="text-sm opacity-80 uppercase font-bold">Total Packets</p>
                <p className="text-4xl font-black">{data.length}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-80">
              <h3 className="text-lg font-bold mb-4">Live Telemetry Trends</h3>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[...data].reverse().slice(-15)}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="id" hide />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="temperature" stroke="#f97316" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="humidity" stroke="#3b82f6" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* VIEW 2: ALERTS & ACKNOWLEDGE */}
        {view === 'alerts' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-4">
            <h2 className="text-2xl font-bold text-red-600 flex items-center gap-2">Active Violations</h2>
            {alerts.length === 0 ? <p className="text-slate-400">All systems normal.</p> : 
              alerts.map(a => (
                <div key={a.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-red-50 transition">
                  <div>
                    <h4 className="font-bold text-slate-800">{a.topic}</h4>
                    <p className="text-sm text-red-600 font-medium">{a.violated_key}: {a.actual_value} (Limit: {a.threshold_value})</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1"><Clock size={12}/> {new Date(a.timestamp).toLocaleString()}</p>
                  </div>
                  <button onClick={() => handleAcknowledge(a.id)} className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-600 hover:text-white transition font-bold flex items-center gap-2">
                    <CheckCircle size={18}/> Acknowledge
                  </button>
                </div>
              ))
            }
          </div>
        )}

        {/* VIEW 3: RAW LOGS WITH FILTERS & PAGINATION */}
        {view === 'raw' && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <h2 className="text-2xl font-bold flex items-center gap-2"><Database /> Sensor History</h2>
              <div className="flex gap-2">
                {/* Topic Dropdown Filter */}
                <select onChange={(e) => setFilterTopic(e.target.value)} className="border p-2 rounded-lg text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500">
                  {uniqueTopics.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <input type="text" placeholder="Search..." className="border p-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>

            <table className="w-full text-left">
              <thead className="bg-slate-900 text-white text-xs uppercase">
                <tr><th className="p-4">Topic</th><th className="p-4">Temp</th><th className="p-4">Hum</th><th className="p-4">Volt</th><th className="p-4 text-right">Time</th></tr>
              </thead>
              <tbody className="divide-y">
                {currentRecords.map(d => (
                  <tr key={d.id} className="hover:bg-slate-50 text-sm">
                    <td className="p-4 font-bold text-blue-600">{d.topic}</td>
                    <td className="p-4">{d.temperature?.toFixed(2)}</td>
                    <td className="p-4">{d.humidity?.toFixed(2)}</td>
                    <td className="p-4">{d.voltage?.toFixed(2)}</td>
                    <td className="p-4 text-right text-slate-400">{new Date(d.timestamp).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="mt-6 flex justify-between items-center">
              <p className="text-sm text-slate-500">Showing {firstIndex + 1} to {Math.min(lastIndex, filteredData.length)} of {filteredData.length}</p>
              <div className="flex gap-2">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="p-2 border rounded hover:bg-slate-100 disabled:opacity-30"><ChevronLeft/></button>
                <button disabled={currentPage === npage} onClick={() => setCurrentPage(currentPage + 1)} className="p-2 border rounded hover:bg-slate-100 disabled:opacity-30"><ChevronRight/></button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;