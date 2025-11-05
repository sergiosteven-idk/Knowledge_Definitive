import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import apiClient from '../utils/apiClient.js';
import { useAnnouncer } from './useAnnouncer.js';

const PROFILE_QUERY_KEY = ['profile'];

const parseAuthResponse = (data) => {
  if (data?.accessToken) {
    localStorage.setItem('knowledge:access-token', data.accessToken);
  }
  if (data?.refreshToken) {
    localStorage.setItem('knowledge:refresh-token', data.refreshToken);
  }
  return data;
};

export const useProfile = () => {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: async () => {
      const { data } = await apiClient.get('/users/me');
      return data;
    },
    staleTime: 1000 * 60 * 10,
    retry: false
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const announce = useAnnouncer();

  return useMutation({
    mutationFn: async (credentials) => {
      const { data } = await apiClient.post('/auth/login', credentials);
      return parseAuthResponse(data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      announce('Ingreso exitoso. Redirigiendo a tu panel.');
      return data;
    },
    onError: () => {
      announce('No pudimos iniciar sesión. Verifica tus credenciales.');
    }
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  const announce = useAnnouncer();

  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await apiClient.post('/auth/register', payload);
      return parseAuthResponse(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      announce('Registro exitoso. ¡Bienvenido a Knowledge Definitive!');
    },
    onError: () => announce('No pudimos registrar tu cuenta. Intenta más tarde o verifica los datos.')
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const refreshToken = localStorage.getItem('knowledge:refresh-token');
      await apiClient.post('/auth/logout', { refreshToken });
    },
    onSettled: () => {
      localStorage.removeItem('knowledge:access-token');
      localStorage.removeItem('knowledge:refresh-token');
      queryClient.removeQueries({ queryKey: PROFILE_QUERY_KEY });
    }
  });
};

export const useAuthHydrator = () => {
  const announce = useAnnouncer();
  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      announce('Tu navegador no soporta lectura en voz alta.');
    }
  }, [announce]);
};
