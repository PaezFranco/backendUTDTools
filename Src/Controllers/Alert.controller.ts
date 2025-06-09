import { Request, Response } from 'express';
import Alert from '../Models/Alert.model';

export const getStudentAlerts = async (req: Request, res: Response): Promise<Response> => {
  try {
    const studentId = (req as any).user.id;
    const alerts = await Alert.find({ estudiante_id: studentId, resuelta: false })
      .populate('herramienta_id', 'nombre');
    return res.json(alerts);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching alerts', error });
  }
};
