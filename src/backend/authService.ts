import { User } from '../types';

export const authService = {
  login: async (username: string, password: string): Promise<User> => {
    
    // Simple validation - accepts any username/password with minimum length
    if (username.length >= 3 && password.length >= 4) {
      const user: User = {
        username,
        isAuthenticated: true,
      };
      return user;
    } else {
      throw new Error('Invalid username or password');
    }
  },
};