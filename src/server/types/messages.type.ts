import 'express';

declare module 'express' {
  interface MessageRequest {
    flash(type: string, message: string): void;
    session: {
      messages?: string[];
      toasts?: string[];
      [key: string]: any;
    };
  }
}
