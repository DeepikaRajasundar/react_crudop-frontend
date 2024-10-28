const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/student_db', {
   useNewUrlParser: true,
   useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

// Define Student schema
const StudentSchema = new mongoose.Schema({
   name: String,
   rollno: Number,
   age: Number,
   email: String,
});

const Student = mongoose.model('Student', StudentSchema);

// CRUD routes
app.get('/students', async (req, res) => {
   try {
      const students = await Student.find();
      res.json(students);
   } catch (err) {
      res.status(500).json({ message: err.message });
   }
});

app.post('/students', async (req, res) => {
   try {
      const newStudent = new Student(req.body);
      await newStudent.save();
      res.json(newStudent);
   } catch (err) {
      res.status(400).json({ message: err.message });
   }
});

app.put('/students/:id', async (req, res) => {
   try {
      const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updatedStudent);
   } catch (err) {
      res.status(400).json({ message: err.message });
   }
});

app.delete('/students/:id', async (req, res) => {
   try {
      await Student.findByIdAndDelete(req.params.id);
      res.json({ message: 'Student deleted' });
   } catch (err) {
      res.status(500).json({ message: err.message });
   }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
