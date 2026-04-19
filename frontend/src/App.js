import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, UserPlus, Database, Activity, User, Search, Loader2, BookOpen, Hash } from 'lucide-react';
import './App.css';

function App() {
  // 1. Updated State to handle multiple fields
  const [formData, setFormData] = useState({ name: "", age: "", course: "" });
  const [allStudents, setAllStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [isLoading, setIsLoading] = useState(false);

  // 2. Updated URL to match the new Backend Route
  const API_URL = 'http://localhost:5001/api/students';

  const getData = async () => {
    try {
      const res = await axios.get(API_URL);
      setAllStudents(res.data);
    } catch (err) { console.error("Fetch Error:", err); }
  };

  useEffect(() => { getData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation: Ensure all fields are filled
    if (!formData.name || !formData.age || !formData.course) {
        alert("Please fill all fields!");
        return;
    }
    
    setIsLoading(true);
    try {
      await axios.post(API_URL, formData);
      setFormData({ name: "", age: "", course: "" }); // Clear the form
      await getData(); 
    } catch (err) { alert("Error adding student"); }
    setIsLoading(false);
  };

  const deleteStudent = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      getData();
    } catch (err) { alert("Error deleting student"); }
  };

  const filteredStudents = allStudents.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="logo"><div className="logo-icon">S</div><span>Student Portal</span></div>
        <nav>
          <div className="nav-item active"><Database size={18}/> <span>Directory</span></div>
          <div className="nav-item"><Activity size={18}/> <span>Activity</span></div>
        </nav>
      </aside>

      <main className="main-content">
        <header className="top-bar">
          <div className="search-container">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by name or course..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="status-indicator"><span className="dot"></span>System Online</div>
        </header>

        <section className="stats-row">
          <div className="stat-card"><h4>Total Students</h4><p>{allStudents.length}</p></div>
          <div className="stat-card"><h4>Query Matches</h4><p>{filteredStudents.length}</p></div>
        </section>

        <section className="content-grid">
          <div className="action-panel">
            <h3>New Enrollment</h3>
            <form onSubmit={handleSubmit}>
              <div className="input-wrapper">
                <User size={18} className="input-icon" />
                <input 
                  placeholder="Full Name" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="input-wrapper">
                <Hash size={18} className="input-icon" />
                <input 
                  type="number" 
                  placeholder="Age" 
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                />
              </div>
              <div className="input-wrapper">
                <BookOpen size={18} className="input-icon" />
                <input 
                  placeholder="Course Name" 
                  value={formData.course}
                  onChange={(e) => setFormData({...formData, course: e.target.value})}
                />
              </div>
              <button type="submit" className="primary-btn" disabled={isLoading}>
                {isLoading ? <Loader2 className="spinner" size={18} /> : <UserPlus size={18} />}
                <span>{isLoading ? "Enrolling..." : "Register Student"}</span>
              </button>
            </form>
          </div>

          <div className="list-panel">
            <h3>Student Directory</h3>
            <div className="user-table">
              {filteredStudents.length === 0 ? (
                <div className="empty-state">📭 <p>No records found.</p></div>
              ) : (
                filteredStudents.map((student) => (
                  <div key={student._id} className="table-row animate-in">
                    <div className="user-info">
                      <div className="avatar">{student.name.charAt(0)}</div>
                      <div>
                        <div className="name-text">{student.name}</div>
                        <div className="date-text">Age: {student.age} | {student.course}</div>
                      </div>
                    </div>
                    <button onClick={() => deleteStudent(student._id)} className="delete-icon">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;