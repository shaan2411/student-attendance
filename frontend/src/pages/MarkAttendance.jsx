import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const SUBJECTS = ['General', 'Mathematics', 'Physics', 'Computer Science', 'English', 'Chemistry', 'Biology'];

const MarkAttendance = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [subject, setSubject] = useState('General');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const [studentsRes, classesRes] = await Promise.all([
          api.get('/students?limit=200'),
          api.get('/students/classes'),
        ]);
        const sList = studentsRes.data.students || [];
        setStudents(sList);
        setClasses(classesRes.data.classes || []);

        // Initialize all as 'present'
        const init = {};
        sList.forEach((s) => { init[s._id] = 'present'; });
        setAttendance(init);
      } catch (err) {
        toast.error('Failed to load students.');
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  // Load existing attendance when date/subject changes
  useEffect(() => {
    const loadExisting = async () => {
      try {
        const res = await api.get(`/attendance/date/${date}?subject=${subject}`);
        const existing = res.data.records || [];
        if (existing.length > 0) {
          const map = {};
          existing.forEach((r) => {
            if (r.student) map[r.student._id] = r.status;
          });
          setAttendance((prev) => ({ ...prev, ...map }));
        }
      } catch {/* ignore */}
    };
    if (date) loadExisting();
  }, [date, subject]);

  const filteredStudents = students.filter((s) => {
    const matchSearch =
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.studentId?.toLowerCase().includes(search.toLowerCase());
    const matchClass = !filterClass || s.class === filterClass;
    return matchSearch && matchClass;
  });

  const setStatus = (id, status) => {
    setAttendance((prev) => ({ ...prev, [id]: status }));
  };

  const markAll = (status) => {
    const update = {};
    filteredStudents.forEach((s) => { update[s._id] = status; });
    setAttendance((prev) => ({ ...prev, ...update }));
  };

  const handleSubmit = async () => {
    if (filteredStudents.length === 0) return toast.error('No students to mark.');
    setSaving(true);
    try {
      const records = filteredStudents.map((s) => ({
        studentId: s._id,
        status: attendance[s._id] || 'absent',
      }));
      await api.post('/attendance/mark', { date, subject, records });
      toast.success(`✅ Attendance saved for ${records.length} students!`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save attendance.');
    } finally {
      setSaving(false);
    }
  };

  const presentCount = filteredStudents.filter((s) => attendance[s._id] === 'present').length;
  const absentCount = filteredStudents.filter((s) => attendance[s._id] === 'absent').length;
  const lateCount = filteredStudents.filter((s) => attendance[s._id] === 'late').length;

  if (loading) return <div className="loading-container"><div className="spinner" /></div>;

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Mark Attendance</h1>
          <p className="page-subtitle">Record daily attendance for students</p>
        </div>
      </div>

      {/* Controls */}
      <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 16 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Subject</label>
            <select className="form-select" value={subject} onChange={(e) => setSubject(e.target.value)}>
              {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Filter by Class</label>
            <select className="form-select" value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
              <option value="">All Classes</option>
              {classes.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Search</label>
            <input
              type="text"
              className="form-input"
              placeholder="Name or Student ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Quick actions */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="btn btn-success btn-sm" onClick={() => markAll('present')}>✓ All Present</button>
          <button className="btn btn-danger btn-sm" onClick={() => markAll('absent')}>✗ All Absent</button>
          <button className="btn btn-secondary btn-sm" onClick={() => markAll('late')}>⏱ All Late</button>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13 }}><span style={{ color: '#10b981', fontWeight: 700 }}>{presentCount}</span> Present</span>
            <span style={{ fontSize: 13 }}><span style={{ color: '#f43f5e', fontWeight: 700 }}>{absentCount}</span> Absent</span>
            <span style={{ fontSize: 13 }}><span style={{ color: '#f59e0b', fontWeight: 700 }}>{lateCount}</span> Late</span>
          </div>
        </div>
      </div>

      {/* Student List */}
      <div className="glass-card" style={{ padding: 0 }}>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>ID</th>
                <th>Class</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>
                    No students found
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const status = attendance[student._id] || 'present';
                  return (
                    <tr key={student._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div className="avatar" style={{ width: 34, height: 34, fontSize: 13 }}>
                            {student.name?.[0]}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600 }}>{student.name}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <code style={{ background: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: 4, fontSize: 12, fontWeight: 600, border: '1px solid #dbeafe' }}>
                          {student.studentId}
                        </code>
                      </td>
                      <td>{student.class || '—'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {['present', 'absent', 'late'].map((s) => (
                            <button
                              key={s}
                              onClick={() => setStatus(student._id, s)}
                              style={{
                                padding: '5px 12px',
                                borderRadius: 6,
                                border: status === s
                                  ? `1.5px solid ${s === 'present' ? '#16a34a' : s === 'absent' ? '#dc2626' : '#d97706'}`
                                  : '1.5px solid #e2e8f0',
                                background: status === s
                                  ? s === 'present' ? '#dcfce7' : s === 'absent' ? '#fee2e2' : '#fef9c3'
                                  : '#f8fafc',
                                color: status === s
                                  ? s === 'present' ? '#15803d' : s === 'absent' ? '#dc2626' : '#a16207'
                                  : '#94a3b8',
                                cursor: 'pointer',
                                fontSize: 12,
                                fontWeight: 600,
                                textTransform: 'capitalize',
                                transition: 'var(--transition)',
                                fontFamily: 'inherit',
                              }}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Save Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
        <button
          id="save-attendance-btn"
          className="btn btn-primary btn-lg"
          onClick={handleSubmit}
          disabled={saving || filteredStudents.length === 0}
        >
          {saving ? <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Saving…</> : `💾 Save Attendance (${filteredStudents.length} students)`}
        </button>
      </div>
    </div>
  );
};

export default MarkAttendance;
