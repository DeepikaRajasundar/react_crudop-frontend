import React, { useState, useEffect } from 'react';
import './CrudApp.css';
import axios from 'axios';

function CrudApp() {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({ name: '', rollno: '', age: '', email: '' });
  const [editing, setEditing] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const addStudent = async () => {
    try {
      await axios.post('http://localhost:5000/students', newStudent);
      fetchStudents();
      setNewStudent({ name: '', rollno: '', age: '', email: '' });
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  const editStudent = (student) => {
    setEditing(true);
    setCurrentStudent(student);
    setNewStudent(student);
  };

  const updateStudent = async () => {
    try {
      await axios.put(`http://localhost:5000/students/${currentStudent._id}`, newStudent);
      setEditing(false);
      setNewStudent({ name: '', rollno: '', age: '', email: '' });
      fetchStudents();
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  const deleteStudent = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/students/${id}`);
      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent({ ...newStudent, [name]: value });
  };

  return (
    <div className="crud-container">
      <h1>Student Database CRUD</h1>
      <div className="form-container">
        <input
          type="text"
          name="name"
          value={newStudent.name}
          onChange={handleInputChange}
          placeholder="Name"
        />
        <input
          type="number"
          name="rollno"
          value={newStudent.rollno}
          onChange={handleInputChange}
          placeholder="Roll No"
        />
        <input
          type="number"
          name="age"
          value={newStudent.age}
          onChange={handleInputChange}
          placeholder="Age"
        />
        <input
          type="email"
          name="email"
          value={newStudent.email}
          onChange={handleInputChange}
          placeholder="Email"
        />
        <button onClick={editing ? updateStudent : addStudent}>
          {editing ? 'Update Student' : 'Add Student'}
        </button>
      </div>
      <ul>
        {students.map((student) => (
          <li key={student._id}>
            <span className="student-info">
              {student.name} - {student.rollno} - {student.age} - {student.email}
            </span>
            <div className="actions">
              <button onClick={() => editStudent(student)}>Edit</button>
              <button onClick={() => deleteStudent(student._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CrudApp;
