import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import {
  RadialBarChart, RadialBar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [recentRecords, setRecentRecords] = useState([]);
  const [subjectStats, setSubjectStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pctRes, recordsRes] = await Promise.all([
          api.get(`/attendance/percentage/${user._id}`),
          api.get(`/attendance/student/${user._id}?limit=10`),
        ]);
        setSummary(pctRes.data);
        setRecentRecords(recordsRes.data.records || []);

        // Subject breakdown
        const subjects = ['Mathematics', 'Physics', 'Computer Science', 'English'];
        const subjectData = await Promise.all(
          subjects.map(async (sub) => {
            const res = await api.get(`/attendance/percentage/${user._id}?subject=${sub}`);
            return { subject: sub.substring(0, 8), percentage: res.data.percentage, total: res.data.total };
          })
        );
        setSubjectStats(subjectData.filter((s) => s.total > 0));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user._id]);

  const pct = summary?.percentage ?? 0;
  const pctColor = pct >= 75 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#f43f5e';
  const pctLabel = pct >= 75 ? 'Excellent' : pct >= 50 ? 'Needs Improvement' : 'Critical';

  const radialData = [{ name: 'Attendance', value: pct, fill: pctColor }];

  if (loading) return <div className="loading-container"><div className="spinner" /></div>;

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Dashboard</h1>
          <p className="page-subtitle">Welcome back, {user.name}! Here's your attendance overview.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <span className="badge badge-student">Student ID: {user.studentId}</span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{user.class} • {user.department}</span>
        </div>
      </div>

      {/* Top row */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24, marginBottom: 28 }}>
        {/* Big attendance ring */}
        <div className="glass-card" style={{ padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20, color: 'var(--text-secondary)' }}>Overall Attendance</h2>
          <div style={{ position: 'relative', width: 180, height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" barSize={14} data={radialData} startAngle={90} endAngle={-270}>
                <RadialBar background={{ fill: 'rgba(255,255,255,0.05)' }} dataKey="value" cornerRadius={8} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div style={{
              position: 'absolute', inset: 0, display: 'flex',
              flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: pctColor }}>{pct}%</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{pctLabel}</div>
            </div>
          </div>
          <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, width: '100%' }}>
            <div style={{ background: '#dcfce7', borderRadius: 10, padding: 12, border: '1px solid #bbf7d0' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#15803d' }}>{summary?.present || 0}</div>
              <div style={{ fontSize: 12, color: '#166534' }}>Present</div>
            </div>
            <div style={{ background: '#ffe4e6', borderRadius: 10, padding: 12, border: '1px solid #fecdd3' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#be123c' }}>{(summary?.total || 0) - (summary?.present || 0)}</div>
              <div style={{ fontSize: 12, color: '#9f1239' }}>Absent</div>
            </div>
          </div>
        </div>

        {/* Subject breakdown bar chart */}
        <div className="glass-card" style={{ padding: 28 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Subject-wise Attendance</h2>
          {subjectStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={subjectStats} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="subject" stroke="#475569" fontSize={12} />
                <YAxis domain={[0, 100]} stroke="#475569" fontSize={12} unit="%" />
                <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #d1d9f0', borderRadius: 8, boxShadow: '0 4px 16px rgba(37,99,235,0.1)' }}
                formatter={(v) => [`${v}%`, 'Attendance']}
              />
                <Bar dataKey="percentage" name="Attendance %" radius={[6, 6, 0, 0]}
                  fill="url(#barGrad)"
                />
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ padding: 24 }}>
              <p>No subject data available yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Records */}
      <div className="glass-card" style={{ padding: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700 }}>Recent Attendance</h2>
          <a href="/student/attendance" className="btn btn-secondary btn-sm">View All</a>
        </div>
        {recentRecords.length > 0 ? (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {recentRecords.map((rec) => (
                  <tr key={rec._id}>
                    <td>{new Date(rec.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td><span style={{ fontWeight: 500 }}>{rec.subject}</span></td>
                    <td><span className={`badge badge-${rec.status}`}>{rec.status}</span></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{rec.remarks || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h3>No attendance records yet</h3>
            <p>Your attendance will appear here once marked by admin.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
