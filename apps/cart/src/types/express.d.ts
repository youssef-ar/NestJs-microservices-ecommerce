
declare module 'express' {
    interface Request {
      user?: {
        id: number;
        createdAt?: Date;
        updatedAt?: Date;
        email?: string;
        firstName?: string;
        role?: string;
        lastName?: string;

      };
      sessionID?: string;
    }
  }