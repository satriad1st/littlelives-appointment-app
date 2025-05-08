import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

// Define the error structure 
interface FormattedError {
  message: string;
  field?: string;  // Optional field
}

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors: FormattedError[] = errors.array().map((error: any) => ({
      message: error.msg,
      field: error.path || 'unknown',
    }));

    return res.status(400).json({ errors: formattedErrors });
  }

  next();
};
