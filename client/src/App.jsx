import React, { useEffect, useState } from 'react';
import './App.css';

const emptyForm = { studentId: '', name: '', email: '' };

async function request(path, options = {}) {
  const isRead = !options.method || options.method === 'GET';
  for (let attempt = 0; attempt < (isRead ? 12 : 1); attempt += 1) {
    let response;
    try {
      response = await fetch(path, options);
    } catch (error) {
      if (!isRead || attempt === 11) throw error;
      await new Promise(resolve => setTimeout(resolve, 5000));
      continue;
    }
    if (isRead && [502, 503, 504].includes(response.status) && attempt < 11) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      continue;
    }
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      throw new Error('Máy chủ đang tạm thời không sẵn sàng. Vui lòng thử lại.');
    }
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || data.message || 'Yêu cầu không thành công.');
    return data;
  }
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
    <main className="page-shell">
      <header className="site-header">
        <div className="brand"><span className="brand-mark">H.</span><span>HỒ SƠ SINH VIÊN</span></div>
        <span className="course-label">THỰC HÀNH ĐIỆN TOÁN ĐÁM MÂY</span>
      </header>

      <section className="intro">
        <div>
          <p className="eyebrow">PHIÊN BẢN 2.0 · PRODUCTION CLOUD PAAS</p>
          <h1>Quản lý sinh viên</h1>
          <p className="intro-copy">Thêm, xem, sửa và xóa thông tin sinh viên trên MongoDB Atlas.</p>
        </div>
        <div className="student-count" aria-label={`${students.length} sinh viên đã lưu`}>
          <strong>{String(students.length).padStart(2, '0')}</strong>
          <span>SINH VIÊN ĐÃ LƯU</span>
        </div>
      </section>

      {error && <div className="error-banner" role="alert">{error}<button type="button" onClick={fetchStudents}>Thử lại</button></div>}

      <section className="workspace">
        <form className="student-form" onSubmit={handleSubmit}>
          <p className="section-number">01 / {editingId ? 'CHỈNH SỬA' : 'THÊM MỚI'}</p>
          <h2>Thông tin sinh viên</h2>
          <p className="section-copy">Điền đủ ba trường bên dưới.</p>
          <label htmlFor="studentId">Mã số sinh viên</label>
          <input id="studentId" name="studentId" value={formData.studentId} onChange={handleChange} placeholder="Ví dụ: 236894" required />
          <label htmlFor="name">Họ và tên</label>
          <input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Ví dụ: Trần Gia Hân" required />
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="sinhvien@nctu.edu.vn" required />
          <button className="primary-button" type="submit">{editingId ? 'Lưu thay đổi' : 'Thêm sinh viên'} <span aria-hidden="true">↗</span></button>
          {editingId && <button className="cancel-button" type="button" onClick={cancelEdit}>Hủy chỉnh sửa</button>}
        </form>

        <div className="list-panel">
          <div className="list-heading">
            <div><p className="section-number">02 / DANH SÁCH</p><h2>Sinh viên đã đăng ký</h2></div>
            <button className="refresh-button" type="button" onClick={fetchStudents} disabled={loading}>Làm mới ↻</button>
          </div>
          {loading ? <p className="status-copy">Đang tải dữ liệu. Máy chủ miễn phí có thể cần khoảng một phút để khởi động...</p> : (
            <div className="table-scroll">
              <table>
                <thead><tr><th>MSSV</th><th>HỌ VÀ TÊN</th><th>EMAIL</th><th>THAO TÁC</th></tr></thead>
                <tbody>
                  {students.map(student => (
                    <tr key={student._id}>
                      <td className="student-id">{student.studentId}</td><td>{student.name}</td><td>{student.email}</td>
                      <td className="actions"><button type="button" onClick={() => startEdit(student)}>Sửa</button><button type="button" onClick={() => handleDelete(student)}>Xóa</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {students.length === 0 && !error && <p className="status-copy">Chưa có sinh viên. Hãy thêm bản ghi đầu tiên.</p>}
              <div className="table-footer"><span>{students.length} kết quả</span><span>React → Express → MongoDB</span></div>
            </div>
          )}
        </div>
      </section>
      <footer className="site-footer"><span>TRẦN GIA HÂN · 236894</span><span>Cloud Lab · 2026</span></footer>
    </main>
  );
}

export default App;
