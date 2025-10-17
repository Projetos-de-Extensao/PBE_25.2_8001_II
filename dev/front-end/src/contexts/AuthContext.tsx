import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'student' | 'monitor' | 'coordinator';

export interface User {
  id: string;
  nome: string;
  email: string;
  matricula?: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    nome: 'João Silva',
    email: 'joao.silva@ibmec.edu.br',
    matricula: '2023001',
    role: 'student'
  },
  {
    id: '2',
    nome: 'Maria Santos',
    email: 'maria.santos@ibmec.edu.br',
    matricula: '2022001',
    role: 'monitor'
  },
  {
    id: '3',
    nome: 'Prof. Carlos Lima',
    email: 'carlos.lima@ibmec.edu.br',
    role: 'coordinator'
  }
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in real app, this would call an API
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};