export interface Student {
  id: number;
  name: string;
  studentId: string | null;
  className: string | null;
  submitted: boolean;
  emailMatch?: string;
  submissionTime?: string;
}

export interface HomeworkItem {
  id: number;
  studentId: number | null;
  fileName: string;
  originalName: string;
  emailFrom: string;
  emailDate: string;
}

export interface AppConfig {
  email: string;
  password: string;
  server: string;
  port: number;
  namingRule: string;
}
