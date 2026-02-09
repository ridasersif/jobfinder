export interface User {
  id?: number;       // facultatif, généré par JSON Server
  firstName: string; // prénom
  lastName: string;  // nom
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
