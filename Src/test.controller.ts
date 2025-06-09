import { Request, Response } from 'express';

export const testRoute = async (_req: Request, res: Response): Promise<Response> => {
  return res.json({ message: 'Test OK' });
};
