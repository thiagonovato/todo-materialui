import { createContext, useContext, useEffect, useState } from 'react';
import authService from '../services/auth';
import { auth } from '../services/firebase';

interface IState {
  isAuthenticated: boolean;
  user: any;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  register: (email: string, password: string, confirmPassword: string) => Promise<any>;
}

interface IProps {
  children?: JSX.Element | JSX.Element[];
}

const AuthContext = createContext({} as IState);

export const AuthProvider = ({ children }: IProps) => {
  const [user, setUser] = useState<any>();
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    async function loadUser() {
      auth.onAuthStateChanged(function (user) {
        if (user) {
          setUser(user)
          setLoading(false)
        } else {
          setLoading(false)
        }
      })
    }
    loadUser()
  }, [])

  const login = async (email: string, password: string) => {
    const result = await authService.login(email, password);
    if (result.user) setUser(result.user);
    return user;
  }

  const register = async (email: string, password: string, confirmPassword: string) => {
    if (password !== confirmPassword) return { error: true, message: 'Password e confirmação não conferem.' }
    const result = await authService.createUser(email, password)
    return result
  }

  const logout = () => {
    authService.logout();
    setUser(undefined)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, loading, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)