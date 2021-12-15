import { MulterField } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export interface anyClass {
  new (...args: any[]): {};
}

export enum UserRole {
  ADMIN = 'admin',
  CLIENT = 'client',
}

export enum AccountStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  DISABLED = 'disabled',
  CLOSED = 'closed',
}

export interface PageResult {
  pageItems: any[];
  totalPages: number;
  totalItems: number;
}
export interface ApiResponse {
  statusCode: number;
  status: string;
  message: string;
}

export type UploadFields = MulterField & { required?: boolean };
