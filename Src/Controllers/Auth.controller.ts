// import { Request, Response } from 'express';
// import bcrypt from 'bcrypt';
// import Student from '../models/student.model';
// import { generateToken } from '../utils/jwt';

// const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*\(\)_\-])[A-Za-z\d!@#\$%\^&\*\(\)_\-]{6,}$/;

// export const studentRegister = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const { email, password } = req.body;

//     const emailRegex = /^([a-zA-Z0-9_.+-]+)_(\d{7})@utd\.edu\.mx$/;
//     const match = email.match(emailRegex);

//     if (!match) {
//       return res.status(400).json({ message: 'Email must be institutional (e.g., juan_2020123@utd.edu.mx)' });
//     }

//     if (!passwordRegex.test(password)) {
//       return res.status(400).json({
//         message: 'Password must be at least 6 characters and include uppercase, lowercase, number, and one of: ! @ # $ % ^ & * ( ) _ -',
//       });
//     }

//     const matricula = match[2];
//     let student = await Student.findOne({ matricula });

//     const hashedPassword = await bcrypt.hash(password, 10);

//     if (student) {
//       student.email = email;
//       student.password = hashedPassword;
//       student.registro_completo = Boolean(student.full_name && student.carrera);
//       await student.save();
//       return res.status(200).json({ message: 'Student registered', student });
//     }

//     const newStudent = new Student({
//       matricula,
//       email,
//       password: hashedPassword,
//       registro_completo: false,
//     });

//     await newStudent.save();
//     return res.status(201).json({ message: 'Student registered with incomplete data', student: newStudent });
//   } catch (error) {
//     return res.status(500).json({ message: 'Internal server error', error });
//   }
// };

// export const studentLogin = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const { email, password } = req.body;
//     const student = await Student.findOne({ email });

//     if (!student || !student.password) {
//       return res.status(404).json({ message: 'Student not found or not registered' });
//     }

//     const valid = await bcrypt.compare(password, student.password);
//     if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

//     const token = generateToken({ id: student._id, role: 'student' });
//     return res.status(200).json({ token, student });
//   } catch (error) {
//     return res.status(500).json({ message: 'Internal server error', error });
//   }
// };
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import Student from '../Models/Student.model';
import { generateToken } from '../Utils/Jwt';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*\(\)_\-])[A-Za-z\d!@#\$%\^&\*\(\)_\-]{6,}$/;

export const registerStudent = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;

    const emailRegex = /^([a-zA-Z0-9_.+-]+)_(\d{7})@utd\.edu\.mx$/;
    const match = email.match(emailRegex);

    if (!match) {
      return res.status(400).json({ message: 'Email must be institutional (e.g., juan_2020123@utd.edu.mx)' });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters and include uppercase, lowercase, number, and one of: ! @ # $ % ^ & * ( ) _ -',
      });
    }

    const studentId = match[2];
    let student = await Student.findOne({ student_id: studentId });

    const hashedPassword = await bcrypt.hash(password, 10);

    if (student) {
      student.email = email;
      student.password = hashedPassword;
      student.is_profile_complete = Boolean(student.full_name && student.career);
      await student.save();
      return res.status(200).json({ message: 'Student successfully registered', student });
    }

    const newStudent = new Student({
      student_id: studentId,
      email,
      password: hashedPassword,
      is_profile_complete: false,
    });

    await newStudent.save();
    return res.status(201).json({ message: 'Student registered with incomplete profile', student: newStudent });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error });
  }
};

export const loginStudent = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ email });

    if (!student || !student.password) {
      return res.status(404).json({ message: 'Student not found or not registered' });
    }

    const isValid = await bcrypt.compare(password, student.password);
    if (!isValid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken({ id: student._id, role: 'student' });
    return res.status(200).json({ token, student });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error });
  }
};
