export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "instructor" | "admin";
  createdAt: Date;
  updatedAt: Date;
}