import { Response } from 'express';

export const getApplications = async (req: any, res: Response) => {
  try {

    res.json({
      success: true,
      data: []
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
