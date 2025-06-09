// import { Request, Response } from 'express';
// import Student from '../models/student.model';
// import Loan from '../models/loan.model';

// export const getStudentProfile = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const student = await Student.findById((req as any).user.id).select('-password');
//     if (!student) return res.status(404).json({ message: 'Student not found' });
//     return res.json(student);
//   } catch (error) {
//     return res.status(500).json({ message: 'Internal error', error });
//   }
// };

// export const getStudentLoanHistory = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const history = await Loan.find({ estudiante_id: (req as any).user.id })
//       .populate('herramientas_prestadas.herramienta_id', 'nombre codigo_barras')
//       .sort({ fecha_prestamo: -1 });
//     return res.json(history);
//   } catch (error) {
//     return res.status(500).json({ message: 'Could not load history', error });
//   }
// };
import { Request, Response } from 'express';
import Student from '../Models/Student.model';
import Loan from '../Models/Loan.model';

export const getStudentProfile = async (req: Request, res: Response): Promise<Response> => {
  try {
    const student = await Student.findById((req as any).user.id).select('-password');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    return res.json(student);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error });
  }
};

export const getStudentLoanHistory = async (req: Request, res: Response): Promise<Response> => {
  try {
    const history = await Loan.find({ student_id: (req as any).user.id })
      .populate('borrowed_tools.tool_id', 'name barcode')
      .sort({ loan_date: -1 });

    return res.json(history);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load loan history', error });
  }
};
