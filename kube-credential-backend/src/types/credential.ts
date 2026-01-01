export interface Credential {
    id?: number;
    user_id: string;
    credential: any;
    issued_at?: Date;
    issued_by: string;
    status: string;
  }
  