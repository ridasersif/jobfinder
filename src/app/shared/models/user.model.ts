export interface User {
  id?: number;       
  firstName: string; 
  lastName: string;  
  email: string;
  password: string;
}

// User sans mot de passe pour stockage local
export interface UserSession {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
}
