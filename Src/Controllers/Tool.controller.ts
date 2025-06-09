import { Request, Response } from 'express';
import Tool from '../Models/Tool.model';

export const getAllTools = async (_req: Request, res: Response) => {
  const tools = await Tool.find();
  res.json(tools);
};

export const createTool = async (req: Request, res: Response) => {
  const { name, code, description, quantity } = req.body;
  const newTool = new Tool({
    name,
    code,
    description,
    quantity,
    available: quantity,
  });
  await newTool.save();
  res.status(201).json(newTool);
};
