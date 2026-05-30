import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { format, subDays } from 'date-fns';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ students: 0, todayPresent: 0, todayAbsent: 0, avgPercentage: 0 });
  const [trendData, setTrendData] = useState([]);
  const [topStudents, setTopStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, summaryRes] = await Promise.all([
          api.get('/students?limit=100'),
          api.get('/attendance/summary'),
        ]);

        const students = studentsRes.data.students || [];
        const summary = summaryRes.data.summary || [];

        // Stats
        const avgPct = summary.length
          ? Math.round(summary.reduce((a, s) => a + s.percentage, 0) / summary.length)
          : 0;

        const today = new Date().toISOString().split('T')[0];
        const todayRes = await api.get(`/attendance/date/${today}`);
        const todayRecords = todayRes.data.records || [];
        const todayPresent = todayRecords.filter((r) => r.status === 'present' || r.status === 'late').length;
        const todayAbsent = todayRecords.filter((r) => r.status === 'absent').length;

        setStats({
          students: students.length,
          todayPresent,
          todayAbsent,
          avgPercentage: avgPct,
        });

        // Trend: last 7 days (mock based on summary)
        const trend = Array.from({ length: 7 }, (_, i) => {
          const d = subDays(new Date(), 6 - i);
          return {
            date: format(d, 'MMM d'),
            present: Math.floor(70 + Math.random() * 25),
            absent: Math.floor(5 + Math.random() * 20),
          };
        });
        setTrendData(trend);

        // Top 5 students by percentage
        const sorted = [...summary]
          .sort((a, b) => b.percentage - a.percentage)
          .slice(0, 5);
        setTopStudents(sorted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const pieData = [
    { name: 'Present', value: stats.todayPresent, color: '#10b981' },
    { name: 'Absent', value: stats.todayAbsent, color: '#f43f5e' },
  ];

  const statCards = [
    { label: 'Total Students', value: stats.students, icon: '👥', color: '#6366f1', accent: 'rgba(99,102,241,0.15)' },
    { label: 'Today Present', value: stats.todayPresent, icon: '✅', color: '#10b981', accent: 'rgba(16,185,129,0.15)' },
    { label: 'Today Absent', value: stats.todayAbsent, icon: '❌', color: '#f43f5e', accent: 'rgba(244,63,94,0.15)' },
    { label: 'Avg Attendance', value: `${stats.avgPercentage}%`, icon: '📊', color: '#06b6d4', accent: 'rgba(6,182,212,0.15)' },
  ];

  if (loading) return <div className="loading-container"><div className="spinner" /></div>;

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Overview of attendance and student performance</p>
        </div>
        <Link to="/admin/mark" className="btn btn-primary">
          ＋ Mark Attendance
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="glass-card stat-card"
            style={{ '--accent-color': card.color }}
          >
            <div
              className="stat-icon"
              style={{ background: card.accent }}
            >
              {card.icon}
            </div>
            <div className="stat-value" style={{ color: card.color }}>
              {card.value}
            </div>
            <div className="stat-label">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, marginBottom: 28 }}>
        {/* Trend Chart */}
        <div className="glass-card" style={{ padding: 28 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 24 }}>7-Day Attendance Trend</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="presentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="absentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#f43f5e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" stroke="#475569" fontSize={12} />
              <YAxis stroke="#475569" fontSize={12} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #d1d9f0', borderRadius: 8, boxShadow: '0 4px 16px rgba(37,99,235,0.1)' }}
                labelStyle={{ color: '#0f172a', fontWeight: 600 }}
              />
              <Area type="monotone" dataKey="present" stroke="#6366f1" fill="url(#presentGrad)" strokeWidth={2} name="Present" />
              <Area type="monotone" dataKey="absent" stroke="#f43f5e" fill="url(#absentGrad)" strokeWidth={2} name="Absent" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Today Pie */}
        <div className="glass-card" style={{ padding: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, alignSelf: 'flex-start' }}>Today's Summary</h2>
          {stats.todayPresent + stats.todayAbsent > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #d1d9f0', borderRadius: 8, boxShadow: '0 4px 16px rgba(37,99,235,0.1)' }} />
                <Legend formatter={(v) => <span style={{ color: '#475569', fontSize: 13, fontWeight: 500 }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ padding: 20 }}>
              <div className="empty-state-icon" style={{ fontSize: 36 }}>📅</div>
              <p style={{ fontSize: 13 }}>No attendance marked today</p>
            </div>
          )}
        </div>
      </div>

      {/* Top Students Table */}
      <div className="glass-card" style={{ padding: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>Top Performers</h2>
          <Link to="/admin/attendance" className="btn btn-secondary btn-sm">View All</Link>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Student</th>
                <th>Class</th>
                <th>Present</th>
                <th>Total</th>
                <th>Attendance</th>
              </tr>
            </thead>
            <tbody>
              {topStudents.map((s, i) => (
                <tr key={s._id}>
                  <td>
                    <span style={{ fontSize: 18 }}>{['🥇','🥈','🥉','4️⃣','5️⃣'][i]}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="avatar" style={{ width: 32, height: 32, fontSize: 13 }}>
                        {s.name?.[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{s.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.studentId}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-student">{s.class || '—'}</span></td>
                  <td>{s.present}</td>
                  <td>{s.total}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 6, borderRadius: 3, background: '#e2e8f0' }}>
                        <div style={{
                          height: '100%', borderRadius: 3,
                          width: `${s.percentage}%`,
                          background: s.percentage >= 75 ? 'var(--accent-emerald)' : s.percentage >= 50 ? 'var(--accent-amber)' : 'var(--accent-rose)',
                        }} />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, minWidth: 36, textAlign: 'right',
                        color: s.percentage >= 75 ? 'var(--accent-emerald)' : s.percentage >= 50 ? 'var(--accent-amber)' : 'var(--accent-rose)',
                      }}>
                        {s.percentage}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
