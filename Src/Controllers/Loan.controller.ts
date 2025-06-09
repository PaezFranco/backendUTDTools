// import { Request, Response } from 'express';
// import Loan from '../models/loan.model';
// import Tool from '../models/tool.model';
// import Alert from '../models/alert.model';

// export const createLoan = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const { estudiante_id, herramientas_prestadas, supervisor_id, tiempo_configurado } = req.body;

//     const now = new Date();
//     const deadline = new Date(now.getTime() + tiempo_configurado * 60000);

//     for (const item of herramientas_prestadas) {
//       const tool = await Tool.findById(item.herramienta_id);
//       if (!tool || tool.cantidad_disponible < item.cantidad) {
//         return res.status(400).json({ message: `Tool not available: ${item.herramienta_id}` });
//       }
//       tool.cantidad_disponible -= item.cantidad;
//       tool.uso_acumulado += item.cantidad;
//       await tool.save();
//     }

//     const newLoan = new Loan({
//       estudiante_id,
//       supervisor_id,
//       herramientas_prestadas,
//       fecha_prestamo: now,
//       fecha_devolucion_estimada: deadline,
//       tiempo_configurado,
//     });

//     await newLoan.save();
//     return res.status(201).json(newLoan);
//   } catch (error) {
//     return res.status(500).json({ message: 'Error creating loan', error });
//   }
// };

// export const returnLoan = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const loan = await Loan.findById(req.params.id).populate('herramientas_prestadas.herramienta_id');
//     if (!loan) return res.status(404).json({ message: 'Loan not found' });

//     const now = new Date();
//     loan.fecha_devolucion_real = now;
//     loan.estado = now > loan.fecha_devolucion_estimada ? 'retrasado' : 'devuelto';

//     if (loan.estado === 'retrasado') {
//       await new Alert({
//         estudiante_id: loan.estudiante_id,
//         herramienta_id: loan.herramientas_prestadas[0]?.herramienta_id,
//         tipo_alerta: 'retraso',
//       }).save();
//     }

//     for (const item of loan.herramientas_prestadas) {
//       const tool = await Tool.findById(item.herramienta_id);
//       if (tool) {
//         tool.cantidad_disponible += item.cantidad;
//         await tool.save();
//       }
//     }

//     await loan.save();
//     return res.json(loan);
//   } catch (error) {
//     return res.status(500).json({ message: 'Error returning loan', error });
//   }
// };
import { Request, Response } from 'express';
import Loan from '../Models/Loan.model';
import Tool from '../Models/Tool.model';
import Alert from '../Models/Alert.model';

export const createLoan = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { student_id, borrowed_tools, supervisor_id, configured_time } = req.body;

    const now = new Date();
    const estimatedReturn = new Date(now.getTime() + configured_time * 60000);

    for (const item of borrowed_tools) {
      const tool = await Tool.findById(item.tool_id);
      if (!tool || tool.available_quantity < item.quantity) {
        return res.status(400).json({ message: `Tool not available: ${item.tool_id}` });
      }
      tool.available_quantity -= item.quantity;
      tool.total_quantity+= item.quantity;
      await tool.save();
    }

    const newLoan = new Loan({
      student_id,
      supervisor_id,
      borrowed_tools,
      loan_date: now,
      estimated_return_date: estimatedReturn,
      configured_time,
    });

    await newLoan.save();
    return res.status(201).json(newLoan);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating loan', error });
  }
};

export const returnLoan = async (req: Request, res: Response): Promise<Response> => {
  try {
    const loan = await Loan.findById(req.params.id).populate('borrowed_tools.tool_id');
    if (!loan) return res.status(404).json({ message: 'Loan not found' });

    const now = new Date();
    loan.actual_return_date = now;
    loan.status = now > loan.estimated_return_date ? 'delayed' : 'returned';

    if (loan.status === 'delayed') {
      await new Alert({
        student_id: loan.student_id,
        tool_id: loan.borrowed_tools[0]?.tool_id,
        alert_type: 'delay',
      }).save();
    }

    for (const item of loan.borrowed_tools) {
      const tool = await Tool.findById(item.tool_id);
      if (tool) {
        tool.available_quantity += item.quantity;
        await tool.save();
      }
    }

    await loan.save();
    return res.json(loan);
  } catch (error) {
    return res.status(500).json({ message: 'Error returning loan', error });
  }
};
