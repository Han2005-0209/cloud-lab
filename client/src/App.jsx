import React, { useEffect, useState } from 'react';

const emptyForm = { studentId: '', name: '', email: '' };

async function request(path, options = {}) {
  const response = await fetch(path, options);
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error('Máy chủ đang tạm thời không sẵn sàng. Vui lòng thử lại.');
  }
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || data.message || 'Yêu cầu không thành công.');
  return data;
}

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function fetchStudents() {
    setLoading(true);
    setError('');
    try {
      setStudents(await request('/api/students'));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchStudents(); }, []);

  function handleChange(event) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  function startEdit(student) {
    setEditingId(student._id);
    setFormData({ studentId: student.studentId, name: student.name, email: student.email });
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelEdit() {
    setEditingId(null);
    setFormData(emptyForm);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    try {
      await request(editingId ? `/api/students/${editingId}` : '/api/students', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      cancelEdit();
      await fetchStudents();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(student) {
    if (!window.confirm(`Xóa sinh viên ${student.name}?`)) return;
    setError('');
    try {
      await request(`/api/students/${student._id}`, { method: 'DELETE' });
      if (editingId === student._id) cancelEdit();
      await fetchStudents();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main style={{ maxWidth: 1000, margin: '32px auto', padding: 20, fontFamily: 'sans-serif' }}>
      <h1>Quản lý sinh viên</h1>
      <p>Phiên bản 2.0 - Production Cloud PaaS</p>
      <p>Thêm, xem, sửa và xóa sinh viên trên MongoDB Atlas.</p>
      {error && <p role="alert" style={{ color: '#a12622' }}>{error} <button onClick={fetchStudents}>Thử lại</button></p>}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 10, marginBottom: 32 }}>
        <h2>{editingId ? 'Sửa sinh viên' : 'Thêm sinh viên'}</h2>
        <label>Mã số sinh viên <input name="studentId" value={formData.studentId} onChange={handleChange} required /></label>
        <label>Họ và tên <input name="name" value={formData.name} onChange={handleChange} required /></label>
        <label>Email <input name="email" type="email" value={formData.email} onChange={handleChange} required /></label>
        <div>
          <button type="submit">{editingId ? 'Lưu thay đổi' : 'Thêm sinh viên'}</button>
          {editingId && <button type="button" onClick={cancelEdit} style={{ marginLeft: 8 }}>Hủy</button>}
        </div>
      </form>

      <h2>Danh sách sinh viên</h2>
      <button type="button" onClick={fetchStudents} disabled={loading}>Làm mới</button>
      {loading ? <p>Đang tải...</p> : (
        <div style={{ overflowX: 'auto', marginTop: 16 }}>
          <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead><tr><th>MSSV</th><th>Họ và tên</th><th>Email</th><th>Thao tác</th></tr></thead>
            <tbody>
              {students.map(student => (
                <tr key={student._id}>
                  <td>{student.studentId}</td><td>{student.name}</td><td>{student.email}</td>
                  <td>
                    <button type="button" onClick={() => startEdit(student)}>Sửa</button>
                    <button type="button" onClick={() => handleDelete(student)} style={{ marginLeft: 8 }}>Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {students.length === 0 && !error && <p>Chưa có sinh viên.</p>}
        </div>
      )}
    </main>
  );
}

export default App;
