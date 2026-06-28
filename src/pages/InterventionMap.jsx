import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { api } from '../api/apiClient';
import Navbar from '../components/Navbar';
import {
    Navigation,
    Layers,
    Eye,
    EyeOff,
    ChevronRight,
    MapPin,
    Radio,
    Gauge,
    Clock,
    Activity,
    Wifi,
} from 'lucide-react';

// ─── Fix Leaflet default marker icons ────────────────────────────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// ─── Color map (inline styles — avoids Tailwind purging dynamic classes) ─────
const TYPE_CONFIG = {
    UA: { color: '#22c55e', label: 'User Agent',     border: '4px' },
    RA: { color: '#f59e0b', label: 'Resource Agent', border: '4px' },
    VA: { color: '#3b82f6', label: 'Vehicle',        border: '4px' },
};

const createIcon = (type) => {
    const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.VA;
    const isSquare = type === 'RA';
    const html = `
        <div style="position:relative;width:32px;height:38px">
            <div style="
                width:30px;height:30px;
                border-radius:${isSquare ? '6px' : '50%'};
                background:${cfg.color};
                border:2.5px solid white;
                box-shadow:0 3px 10px rgba(0,0,0,0.35);
                display:flex;align-items:center;justify-content:center;
                font-size:11px;font-weight:800;color:white;
                font-family:system-ui,sans-serif;
            ">
                ${type[0]}
            </div>
            <div style="
                position:absolute;bottom:0;left:50%;
                transform:translateX(-50%) rotate(45deg);
                width:9px;height:9px;
                background:${cfg.color};
                border-right:2px solid white;
                border-bottom:2px solid white;
            "></div>
        </div>
    `;
    return L.divIcon({ html, className: 'custom-div-icon', iconSize: [32, 38], iconAnchor: [16, 38] });
};

const icons = {
    UA: createIcon('UA'),
    RA: createIcon('RA'),
    VA: createIcon('VA'),
};

// ─── Demo data: 8 units around Casablanca ────────────────────────────────────
const INITIAL_UNITS = [
    { id: 1,  type: 'UA', name: 'Alpha Unit',       lat: 33.5731, lng: -7.5898, status: 'patrolling', speed: 38, heading:  45 },
    { id: 2,  type: 'UA', name: 'Bravo Unit',       lat: 33.5852, lng: -7.6015, status: 'responding', speed: 72, heading:  90 },
    { id: 3,  type: 'UA', name: 'Charlie Unit',     lat: 33.5650, lng: -7.6120, status: 'standby',    speed:  0, heading:   0 },
    { id: 4,  type: 'RA', name: 'Resource Alpha',   lat: 33.5900, lng: -7.5500, status: 'deployed',   speed: 45, heading: 180 },
    { id: 5,  type: 'RA', name: 'Resource Beta',    lat: 33.5780, lng: -7.5750, status: 'online',     speed:  0, heading:   0 },
    { id: 6,  type: 'VA', name: 'Vehicle 01 – CAS', lat: 33.5620, lng: -7.5980, status: 'moving',     speed: 60, heading: 270 },
    { id: 7,  type: 'VA', name: 'Vehicle 02 – CAS', lat: 33.5990, lng: -7.6200, status: 'parked',     speed:  0, heading:   0 },
    { id: 8,  type: 'VA', name: 'Vehicle 03 – CAS', lat: 33.5500, lng: -7.5600, status: 'moving',     speed: 85, heading: 135 },
];

const addLastUpdate = (units) =>
    units.map(u => ({ ...u, lastUpdate: new Date() }));

// ─── Movement simulation ──────────────────────────────────────────────────────
const simulateMovement = (units) =>
    units.map(u => {
        if (u.status === 'standby' || u.status === 'parked') {
            return { ...u, lastUpdate: new Date() };
        }
        const step = 0.0018;
        return {
            ...u,
            lat: u.lat + (Math.random() - 0.5) * step,
            lng: u.lng + (Math.random() - 0.5) * step,
            speed: Math.max(5, Math.min(120, u.speed + (Math.random() - 0.5) * 15)),
            lastUpdate: new Date(),
        };
    });

// ─── Status badge helper ──────────────────────────────────────────────────────
const STATUS_STYLE = {
    moving:     { bg: '#dcfce7', color: '#16a34a' },
    patrolling: { bg: '#dbeafe', color: '#1d4ed8' },
    responding: { bg: '#fef9c3', color: '#ca8a04' },
    deployed:   { bg: '#fce7f3', color: '#9d174d' },
    online:     { bg: '#f3f4f6', color: '#374151' },
    standby:    { bg: '#f3f4f6', color: '#9ca3af' },
    parked:     { bg: '#f3f4f6', color: '#6b7280' },
};

const StatusBadge = ({ status }) => {
    const s = STATUS_STYLE[status] || STATUS_STYLE.online;
    return (
        <span style={{
            background: s.bg, color: s.color,
            padding: '2px 8px', borderRadius: '999px',
            fontSize: '10px', fontWeight: 700, textTransform: 'capitalize',
        }}>
            {status}
        </span>
    );
};

const fmt = (d) => d ? d.toLocaleTimeString('fr-MA', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '—';

// ─── Component ────────────────────────────────────────────────────────────────
const InterventionMap = () => {
    const navigate = useNavigate();
    const [units, setUnits]               = useState(addLastUpdate(INITIAL_UNITS));
    const [loading, setLoading]           = useState(false);
    const [visibility, setVisibility]     = useState({ UA: true, RA: true, VA: true });
    const [sidebarOpen, setSidebarOpen]   = useState(true);
    const [lastSync, setLastSync]         = useState(new Date());
    const unitsRef = useRef(units);

    // Keep ref in sync so interval always has fresh state
    useEffect(() => { unitsRef.current = units; }, [units]);

    useEffect(() => {
        let cancelled = false;

        const tryFetchFromAPI = async () => {
            try {
                const response = await api.get('/view/pos-units');
                if (!cancelled && response.success && Array.isArray(response.records) && response.records.length > 0) {
                    setUnits(addLastUpdate(response.records));
                }
            } catch {
                // API not available — demo mode is already running
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        tryFetchFromAPI();

        // Move units every 30 seconds
        const interval = setInterval(() => {
            if (!cancelled) {
                setUnits(prev => simulateMovement(prev));
                setLastSync(new Date());
            }
        }, 30000);

        return () => {
            cancelled = true;
            clearInterval(interval);
        };
    }, []);

    const toggleVisibility = (type) =>
        setVisibility(prev => ({ ...prev, [type]: !prev[type] }));

    const filteredUnits = units.filter(u => visibility[u.type]);
    const counts = { UA: 0, RA: 0, VA: 0 };
    units.forEach(u => { if (counts[u.type] !== undefined) counts[u.type]++; });

    return (
        <div className="h-screen flex flex-col overflow-hidden">
            <Navbar />

            <div className="flex-1 relative flex overflow-hidden">

                {/* ── Sidebar ── */}
                <div className={`bg-white border-r border-gray-100 flex flex-col transition-all duration-300 z-20 overflow-hidden ${sidebarOpen ? 'w-80' : 'w-0'}`}>
                    {/* Header */}
                    <div className="p-5 border-b border-gray-100">
                        <h2 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                            <Navigation className="w-5 h-5 text-blue-600" /> Live Units
                        </h2>
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                            <Activity className="w-3 h-3" />
                            Demo mode — simulated movement every 30s
                        </p>
                        {/* Type count pills */}
                        <div className="flex gap-2 mt-3">
                            {Object.entries(counts).map(([type, n]) => (
                                <span key={type} style={{
                                    background: TYPE_CONFIG[type].color + '18',
                                    color: TYPE_CONFIG[type].color,
                                    border: `1px solid ${TYPE_CONFIG[type].color}40`,
                                    padding: '2px 10px', borderRadius: 999,
                                    fontSize: 11, fontWeight: 700,
                                }}>
                                    {n} {type}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Unit list */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-2">
                        {units.map(u => (
                            <div
                                key={`${u.type}-${u.id}`}
                                className="p-3 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors cursor-pointer group"
                                style={{ borderLeft: `3px solid ${TYPE_CONFIG[u.type]?.color}` }}
                            >
                                <div className="flex items-center gap-3">
                                    <div style={{
                                        width: 32, height: 32,
                                        borderRadius: u.type === 'RA' ? 6 : '50%',
                                        background: TYPE_CONFIG[u.type]?.color + '18',
                                        border: `2px solid ${TYPE_CONFIG[u.type]?.color}`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <Radio style={{ width: 14, height: 14, color: TYPE_CONFIG[u.type]?.color }} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-gray-900 truncate">{u.name}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-xs text-gray-400">{u.type}</span>
                                            <StatusBadge status={u.status} />
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-gray-700">{Math.round(u.speed)} km/h</p>
                                        <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:translate-x-1 transition-all ml-auto mt-1" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Last sync footer */}
                    <div className="p-3 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-400">
                        <Wifi className="w-3 h-3" />
                        Last sync: {fmt(lastSync)}
                    </div>
                </div>

                {/* ── Sidebar toggle ── */}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="absolute top-1/2 -translate-y-1/2 z-30 bg-white p-2 border border-gray-200 rounded-r-xl shadow-lg hover:bg-gray-50 transition-all"
                    style={{ left: sidebarOpen ? '320px' : '0' }}
                >
                    <ChevronRight className={`w-5 h-5 transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* ── Map ── */}
                <div className="flex-1 relative">
                    <MapContainer
                        center={[33.5731, -7.5898]}
                        zoom={13}
                        style={{ height: '100%', width: '100%' }}
                        zoomControl={true}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />

                        {filteredUnits.map(u => (
                            <Marker
                                key={`${u.type}-${u.id}`}
                                position={[u.lat, u.lng]}
                                icon={icons[u.type] || icons.VA}
                            >
                                <Popup minWidth={200}>
                                    <div style={{ fontFamily: 'system-ui,sans-serif', padding: '4px 2px' }}>
                                        {/* Header */}
                                        <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:10, paddingBottom:8, borderBottom:'1px solid #f1f5f9' }}>
                                            <div style={{
                                                width:28, height:28, borderRadius: u.type === 'RA' ? 5 : '50%',
                                                background: TYPE_CONFIG[u.type]?.color,
                                                display:'flex', alignItems:'center', justifyContent:'center',
                                                color:'white', fontWeight:800, fontSize:11,
                                            }}>
                                                {u.type[0]}
                                            </div>
                                            <div>
                                                <p style={{ fontWeight:700, fontSize:13, color:'#111827', margin:0 }}>{u.name}</p>
                                                <p style={{ fontSize:10, color:'#6b7280', margin:0 }}>{TYPE_CONFIG[u.type]?.label}</p>
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, marginBottom:10 }}>
                                            <div style={{ background:'#f8fafc', borderRadius:8, padding:'6px 8px' }}>
                                                <p style={{ fontSize:9, color:'#9ca3af', margin:'0 0 2px', display:'flex', alignItems:'center', gap:3 }}>
                                                    <span>●</span> STATUS
                                                </p>
                                                <StatusBadge status={u.status} />
                                            </div>
                                            <div style={{ background:'#f8fafc', borderRadius:8, padding:'6px 8px' }}>
                                                <p style={{ fontSize:9, color:'#9ca3af', margin:'0 0 2px' }}>⚡ SPEED</p>
                                                <p style={{ fontSize:13, fontWeight:700, color:'#111827', margin:0 }}>
                                                    {Math.round(u.speed)} <span style={{ fontSize:9, fontWeight:400 }}>km/h</span>
                                                </p>
                                            </div>
                                            <div style={{ background:'#f8fafc', borderRadius:8, padding:'6px 8px', gridColumn:'1/-1' }}>
                                                <p style={{ fontSize:9, color:'#9ca3af', margin:'0 0 2px' }}>📍 POSITION</p>
                                                <p style={{ fontSize:11, fontWeight:500, color:'#374151', margin:0 }}>
                                                    {u.lat.toFixed(5)}, {u.lng.toFixed(5)}
                                                </p>
                                            </div>
                                            <div style={{ background:'#f8fafc', borderRadius:8, padding:'6px 8px', gridColumn:'1/-1', display:'flex', alignItems:'center', gap:6 }}>
                                                <Clock style={{ width:11, height:11, color:'#9ca3af' }} />
                                                <p style={{ fontSize:10, color:'#6b7280', margin:0 }}>
                                                    Last update: <strong>{fmt(u.lastUpdate)}</strong>
                                                </p>
                                            </div>
                                        </div>

                                        {/* Action */}
                                        <button
                                            onClick={() => navigate(u.type === 'VA' ? `/vehicles/${u.id}` : `/users/${u.id}`)}
                                            style={{
                                                width:'100%', padding:'7px 0',
                                                background:'#eff6ff', color:'#2563eb',
                                                border:'none', borderRadius:8,
                                                fontSize:11, fontWeight:700, cursor:'pointer',
                                                display:'flex', alignItems:'center', justifyContent:'center', gap:4,
                                            }}
                                        >
                                            View Details →
                                        </button>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>

                    {/* ── Visibility panel (top-right) ── */}
                    <div style={{ position:'absolute', top:16, right:16, zIndex:1000 }}>
                        <div style={{
                            background:'white', borderRadius:16,
                            boxShadow:'0 4px 24px rgba(0,0,0,0.12)',
                            border:'1px solid #f1f5f9', padding:16, minWidth:190,
                        }}>
                            <h3 style={{ fontSize:12, fontWeight:700, color:'#111827', marginBottom:12, display:'flex', alignItems:'center', gap:6 }}>
                                <Layers style={{ width:14, height:14, color:'#2563eb' }} /> Unit Visibility
                            </h3>
                            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                                {['UA', 'RA', 'VA'].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => toggleVisibility(type)}
                                        style={{
                                            display:'flex', alignItems:'center', justifyContent:'space-between',
                                            padding:'7px 10px', borderRadius:10, border:'1px solid',
                                            borderColor: visibility[type] ? TYPE_CONFIG[type].color + '40' : '#e5e7eb',
                                            background: visibility[type] ? TYPE_CONFIG[type].color + '10' : '#f9fafb',
                                            cursor:'pointer', transition:'all 0.15s',
                                        }}
                                    >
                                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                                            <div style={{
                                                width:10, height:10,
                                                borderRadius: type === 'RA' ? 2 : '50%',
                                                background: visibility[type] ? TYPE_CONFIG[type].color : '#d1d5db',
                                            }} />
                                            <span style={{ fontSize:11, fontWeight:700, color: visibility[type] ? TYPE_CONFIG[type].color : '#9ca3af' }}>
                                                {type} Units ({counts[type]})
                                            </span>
                                        </div>
                                        {visibility[type]
                                            ? <Eye style={{ width:13, height:13, color: TYPE_CONFIG[type].color }} />
                                            : <EyeOff style={{ width:13, height:13, color:'#9ca3af' }} />
                                        }
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Live badge */}
                        <div style={{
                            marginTop:8, background:'white', borderRadius:12,
                            boxShadow:'0 2px 12px rgba(0,0,0,0.08)',
                            border:'1px solid #f1f5f9', padding:'8px 12px',
                            display:'flex', alignItems:'center', gap:6,
                        }}>
                            <span style={{
                                width:8, height:8, borderRadius:'50%',
                                background:'#22c55e',
                                boxShadow:'0 0 0 3px #22c55e30',
                                animation:'pulse-dot 1.5s infinite',
                                display:'inline-block',
                            }} />
                            <span style={{ fontSize:11, fontWeight:600, color:'#374151' }}>
                                LIVE · {filteredUnits.length} units visible
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .leaflet-container { background-color: #f8fafc; }
                .custom-div-icon { background: none !important; border: none !important; }
                @keyframes pulse-dot {
                    0%, 100% { box-shadow: 0 0 0 0 #22c55e50; }
                    50%       { box-shadow: 0 0 0 5px #22c55e20; }
                }
            `}</style>
        </div>
    );
};

export default InterventionMap;
