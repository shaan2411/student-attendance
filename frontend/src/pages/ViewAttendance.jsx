import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const SUBJECTS = ['all', 'Mathematics', 'Physics', 'Computer Science', 'English', 'General'];

const ViewAttendance = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(isAdmin ? '' : user._id);
  const [subject, setSubject] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (isAdmin) {
      api.get('/students?limit=200').then((res) => setStudents(res.data.students || []));
    }
  }, [isAdmin]);

  useEffect(() => {
    if (!selectedStudent) return;

    const fetchRecords = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page,
          limit: 20,
          ...(subject !== 'all' && { subject }),
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
        });

        const [recRes, pctRes] = await Promise.all([
          api.get(`/attendance/student/${selectedStudent}?${params}`),
          api.get(`/attendance/percentage/${selectedStudent}${subject !== 'all' ? `?subject=${subject}` : ''}`),
        ]);

        setRecords(recRes.data.records || []);
        setTotalPages(recRes.data.pages || 1);
        setSummary(pctRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, [selectedStudent, subject, startDate, endDate, page]);

  const filteredStudents = students.filter(
    (s) =>
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.studentId?.toLowerCase().includes(search.toLowerCase())
  );

  const pct = summary?.percentage ?? 0;
  const pctColor = pct >= 75 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#f43f5e';

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">{isAdmin ? 'Attendance Report' : 'My Attendance'}</h1>
          <p className="page-subtitle">
            {isAdmin ? 'View and filter attendance records for any student' : 'Your personal attendance history'}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
          {isAdmin && (
            <div className="form-group" style={{ marginBottom: 0, gridColumn: 'span 2' }}>
              <label className="form-label">Select Student</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search student..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ flex: 1 }}
                />
                <select
                  className="form-select"
                  value={selectedStudent}
                  onChange={(e) => { setSelectedStudent(e.target.value); setPage(1); }}
                  style={{ flex: 2 }}
                >
                  <option value="">— Select Student —</option>
                  {filteredStudents.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name} ({s.studentId})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Subject</label>
            <select className="form-select" value={subject} onChange={(e) => { setSubject(e.target.value); setPage(1); }}>
              {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">From Date</label>
            <input type="date" className="form-input" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">To Date</label>
            <input type="date" className="form-input" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>
      </div>

      {selectedStudent && summary && (
        <>
          {/* Summary cards */}
          <div className="stats-grid" style={{ marginBottom: 24 }}>
            {[
              { label: 'Total Days', value: summary.total, color: '#6366f1', bg: 'rgba(99,102,241,0.1)', icon: '📅' },
              { label: 'Days Present', value: summary.present, color: '#10b981', bg: 'rgba(16,185,129,0.1)', icon: '✅' },
              { label: 'Days Absent', value: summary.total - summary.present, color: '#f43f5e', bg: 'rgba(244,63,94,0.1)', icon: '❌' },
              { label: 'Attendance %', value: `${pct}%`, color: pctColor, bg: `${pctColor}22`, icon: '📊' },
            ].map((card) => (
              <div key={card.label} className="glass-card stat-card">
                <div className="stat-icon" style={{ background: card.bg }}>{card.icon}</div>
                <div className="stat-value" style={{ color: card.color }}>{card.value}</div>
                <div className="stat-label">{card.label}</div>
              </div>
            ))}
          </div>

          {/* Records table */}
          <div className="glass-card" style={{ padding: 0 }}>
            {loading ? (
              <div className="loading-container"><div className="spinner" /></div>
            ) : records.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📋</div>
                <h3>No records found</h3>
                <p>Try adjusting the filters above.</p>
              </div>
            ) : (
              <>
                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Subject</th>
                        <th>Status</th>
                        <th>Marked By</th>
                        <th>Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.map((rec) => (
                        <tr key={rec._id}>
                          <td style={{ fontWeight: 500 }}>
                            {new Date(rec.date).toLocaleDateString('en-US', {
                              weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
                            })}
                          </td>
                          <td>{rec.subject}</td>
                          <td>
                            <span className={`badge badge-${rec.status}`}>
                              <span className={`attendance-dot dot-${rec.status}`} />
                              {rec.status}
                            </span>
                          </td>
                          <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                            {rec.markedBy?.name || 'System'}
                          </td>
                          <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{rec.remarks || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: 20 }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>‹ Prev</button>
                    <span style={{ padding: '6px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>
                      Page {page} of {totalPages}
                    </span>
                    <button className="btn btn-secondary btn-sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next ›</button>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}

      {!selectedStudent && isAdmin && (
        <div className="empty-state glass-card" style={{ padding: 64 }}>
          <div className="empty-state-icon">👆</div>
          <h3>Select a Student</h3>
          <p>Choose a student from the dropdown above to view their attendance records.</p>
        </div>
      )}
    </div>
  );
};

export default ViewAttendance;
