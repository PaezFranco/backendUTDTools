// import { Request, Response } from 'express';
// import IaSuggestion from '../models/iaSuggestion.model';

// export const getSuggestions = async (_req: Request, res: Response): Promise<Response> => {
//   try {
//     const suggestions = await IaSuggestion.find()
//       .populate('herramientas_id', 'nombre')
//       .populate('atendida_por', 'nombre');
//     return res.json(suggestions);
//   } catch (error) {
//     return res.status(500).json({ message: 'Error loading IA suggestions', error });
//   }
// };

// export const markSuggestionAsAttended = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const { id } = req.params;
//     const { supervisor_id } = req.body;

//     const suggestion = await IaSuggestion.findById(id);
//     if (!suggestion) return res.status(404).json({ message: 'Suggestion not found' });

//     suggestion.atendida = true;
//     if (!suggestion.atendida_por.includes(supervisor_id)) {
//       suggestion.atendida_por.push(supervisor_id);
//     }
//     await suggestion.save();

//     return res.json({ message: 'Suggestion marked as attended', suggestion });
//   } catch (error) {
//     return res.status(500).json({ message: 'Error updating suggestion', error });
//   }
// };
import { Request, Response } from 'express';
import IaSuggestion from '../Models/IaSuggestion.model';

export const getIaSuggestions = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const suggestions = await IaSuggestion.find()
      .populate('tools_ids', 'name')
      .populate('attended_by', 'name');
    return res.json(suggestions);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load IA suggestions', error });
  }
};

export const markIaSuggestionAsAttended = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { supervisor_id } = req.body;

    const suggestion = await IaSuggestion.findById(id);
    if (!suggestion) {
      return res.status(404).json({ message: 'Suggestion not found' });
    }

    suggestion.attended = true;

    if (!suggestion.attended_by.includes(supervisor_id)) {
      suggestion.attended_by.push(supervisor_id);
    }

    await suggestion.save();

    return res.json({ message: 'Suggestion marked as attended', suggestion });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update suggestion', error });
  }
};
