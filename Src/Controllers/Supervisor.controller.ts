// import { Request, Response } from 'express';
// import Student from '../models/student.model';

// export const completeStudentProfile = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const { full_name, carrera, cuatrimestre, grupo, telefono } = req.body;
//     const studentId = req.params.id;

//     const student = await Student.findById(studentId);
//     if (!student) {
//       return res.status(404).json({ message: 'Student not found' });
//     }

//     student.full_name = full_name;
//     student.carrera = carrera;
//     student.cuatrimestre = cuatrimestre;
//     student.grupo = grupo;
//     student.telefono = telefono;
//     student.registro_completo = true;

//     await student.save();
//     return res.json({ message: 'Student profile updated successfully', student });
//   } catch (error) {
//     return res.status(500).json({ message: 'Error updating student profile', error });
//   }
// };
import { Request, Response } from 'express';
import Student from '../Models/Student.model';

export const completeStudentProfile = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { full_name, career, semester, group, phone } = req.body;
    const studentId = req.params.id;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    student.full_name = full_name;
    student.career = career;
    student.semester = semester;
    student.group = group;
    student.phone = phone;
    student.is_profile_complete = true;

    await student.save();
    return res.json({ message: 'Student profile updated successfully', student });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating student profile', error });
  }
};
