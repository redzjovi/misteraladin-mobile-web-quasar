import { defineStore } from 'pinia';
import { User } from '../repositories/Repository';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as null | User,
  }),

  actions: {
    setUser(user: null | User) {
      this.user = user;
    },
  },
});
