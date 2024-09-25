import express, { Request, Response } from 'express';
import { generateSignedUrl } from '../utils/getSignedUrl';

async (req: Request, res: Response) => {
    const { fileName } = req.query;
    if (!fileName) {
      return res.status(400).json({ success: false, message: 'fileName query parameter is required.' });
    }
  
    try {
      const signedUrl = await generateSignedUrl(fileName as string);
      res.json({
        success: true,
        url: signedUrl,
      });
    } catch (error:any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
};

export async function generatesignedurl(req:Request,res:Response){
  const { fileName } = req.params;

  if (!fileName) {
    return res.status(400).json({ success: false, message: 'fileName query parameter is required.' });
  }

  try {
    const signedUrl = await generateSignedUrl(fileName as string);
    res.json({
      success: true,
      url: signedUrl,
    });
  } catch (error:any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};