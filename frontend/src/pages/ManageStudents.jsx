import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const INITIAL_FORM = {
  name: '', email: '', password: '', studentId: '',
  class: '', department: '', phone: '',
};

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [classes, setClasses] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [modal, setModal] = useState(null); // 'add' | 'edit' | 'delete'
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page, limit: 15,
        ...(search && { search }),
        ...(filterClass && { class: filterClass }),
      });
      const res = await api.get(`/students?${params}`);
      setStudents(res.data.students || []);
      setTotal(res.data.total || 0);
      setTotalPages(res.data.pages || 1);
    } catch {
      toast.error('Failed to load students.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudents(); }, [page, search, filterClass]);
  useEffect(() => {
    api.get('/students/classes').then((res) => setClasses(res.data.classes || []));
  }, []);

  const openAdd = () => { setForm(INITIAL_FORM); setModal('add'); };
  const openEdit = (student) => {
    setSelected(student);
    setForm({
      name: student.name || '', email: student.email || '',
      password: '', studentId: student.studentId || '',
      class: student.class || '', department: student.department || '',
      phone: student.phone || '',
    });
    setModal('edit');
  };
  const openDelete = (student) => { setSelected(student); setModal('delete'); };
  const closeModal = () => { setModal(null); setSelected(null); };

  const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/students', form);
      toast.success('Student added successfully!');
      closeModal();
      fetchStudents();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to add student.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/students/${selected._id}`, form);
      toast.success('Student updated!');
      closeModal();
      fetchStudents();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update student.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await api.delete(`/students/${selected._id}`);
      toast.success('Student removed.');
      closeModal();
      fetchStudents();
    } catch (err) {
      toast.error('Failed to delete student.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Students</h1>
          <p className="page-subtitle">{total} students enrolled</p>
        </div>
        <button id="add-student-btn" className="btn btn-primary" onClick={openAdd}>＋ Add Student</button>
      </div>

      {/* Filters */}
      <div className="glass-card" style={{ padding: 20, marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="search-bar" style={{ maxWidth: 300 }}>
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="form-input"
              placeholder="Search by name, ID, or email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <select
            className="form-select"
            style={{ width: 180 }}
            value={filterClass}
            onChange={(e) => { setFilterClass(e.target.value); setPage(1); }}
          >
            <option value="">All Classes</option>
            {classes.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card" style={{ padding: 0 }}>
        {loading ? (
          <div className="loading-container"><div className="spinner" /></div>
        ) : students.length === 0 ? (
          <div className="empty-state" style={{ padding: 64 }}>
            <div className="empty-state-icon">👥</div>
            <h3>No students found</h3>
            <p>Add your first student using the button above.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Student ID</th>
                  <th>Class</th>
                  <th>Department</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="avatar" style={{ width: 36, height: 36, fontSize: 14 }}>
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
                        {student.studentId || '—'}
                      </code>
                    </td>
                    <td>{student.class || '—'}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{student.department || '—'}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{student.phone || '—'}</td>
                    <td>
                      <span className={`badge ${student.isActive ? 'badge-present' : 'badge-absent'}`}>
                        {student.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(student)}>✏ Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => openDelete(student)}>🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: 20, borderTop: '1px solid var(--border)' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>‹ Prev</button>
            <span style={{ padding: '6px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>
              Page {page} of {totalPages}
            </span>
            <button className="btn btn-secondary btn-sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next ›</button>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {(modal === 'add' || modal === 'edit') && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal">
            <h2 className="modal-title">{modal === 'add' ? '＋ Add New Student' : '✏ Edit Student'}</h2>
            <form onSubmit={modal === 'add' ? handleAdd : handleEdit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input name="name" className="form-input" value={form.name} onChange={handleFormChange} required placeholder="Alice Johnson" />
                </div>
                <div className="form-group">
                  <label className="form-label">Student ID *</label>
                  <input name="studentId" className="form-input" value={form.studentId} onChange={handleFormChange} required placeholder="STU001" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input type="email" name="email" className="form-input" value={form.email} onChange={handleFormChange} required placeholder="alice@school.com" />
                </div>
                <div className="form-group">
                  <label className="form-label">{modal === 'add' ? 'Password *' : 'New Password (leave blank to keep)'}</label>
                  <input type="password" name="password" className="form-input" value={form.password} onChange={handleFormChange} required={modal === 'add'} placeholder="Min 6 characters" />
                </div>
                <div className="form-group">
                  <label className="form-label">Class</label>
                  <input name="class" className="form-input" value={form.class} onChange={handleFormChange} placeholder="CS-A" />
                </div>
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <input name="department" className="form-input" value={form.department} onChange={handleFormChange} placeholder="Computer Science" />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Phone</label>
                  <input name="phone" className="form-input" value={form.phone} onChange={handleFormChange} placeholder="+1 234 567 8900" />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving…' : modal === 'add' ? 'Add Student' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {modal === 'delete' && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal" style={{ maxWidth: 420, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <h2 className="modal-title">Delete Student?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
              This will permanently delete <strong style={{ color: 'var(--text-primary)' }}>{selected?.name}</strong> and all their attendance records.
              This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete} disabled={saving}>
                {saving ? 'Deleting…' : 'Delete Student'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStudents;
