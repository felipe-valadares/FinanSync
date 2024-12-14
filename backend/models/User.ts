// models/User.ts
export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    new_password?: string;
    role: string;
    company_id: string;
    created_at: Date;
    updated_at: Date;
  }
  