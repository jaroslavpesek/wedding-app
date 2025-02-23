import { Request, Response } from 'express';
import AccessCode from './models/AccessCode';


const verifyAccessCode = async (req: Request, res: Response): Promise<any> => {
  try {
    const { code } = req.params; // code comes from the URL param

    if (!code) {
      return res.status(400).json({ error: 'No code provided in URL' });
    }
    console.log('Code attempt:', code);
    // Use Mongoose to look up the code in MongoDB
    const foundCode = await AccessCode.findOne({ code });
    if (!foundCode) {
      return res.status(401).json({ error: 'Invalid code' });
    }

    // Code found - return success and any info you'd like.
    return res.json({
      success: true,
      obj: foundCode
    });
  } catch (error) {
    console.error('Error verifying code:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default verifyAccessCode;
