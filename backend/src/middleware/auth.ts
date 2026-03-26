import { Request, Response, NextFunction } from "express";

/**
 * Express middleware that verifies the request has an active admin session going
 *
 * @param req - Checks if session data exists
 * @param res - Used only if user was not authorized
 * @param next - Calls the next function in parent function
 * @returns {void}
 */
export const checkIfAdmin = (req: Request, res: Response, next: NextFunction) => {
   if ((req.session as any).user) {
    next();
   } else {
    res.status(401).json({ message: "Not authorized user. "})
    return;
   }
}