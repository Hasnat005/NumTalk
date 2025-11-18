import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from './client';
import type { AuthResponse } from '../types/auth';
import type { CalculationNode } from '../types/calculation';

export const useCalculationTree = () =>
  useQuery({
    queryKey: ['calculations'],
    queryFn: async () => {
      const { data } = await api.get<CalculationNode[]>('/calculations');
      return data;
    },
  });

export const useStartCalculation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (value: number) => {
      const { data } = await api.post('/calculations/start', { value });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calculations'] });
    },
  });
};

export const useRespondToCalculation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      calculationId,
      operation,
      operand,
    }: {
      calculationId: number;
      operation: 'ADD' | 'SUBTRACT' | 'MULTIPLY' | 'DIVIDE';
      operand: number;
    }) => {
      const { data } = await api.post(`/calculations/${calculationId}/respond`, {
        operation,
        operand,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calculations'] });
    },
  });
};

export const useRegister = () =>
  useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      const { data } = await api.post<AuthResponse>('/auth/register', { username, password });
      return data;
    },
  });

export const useLogin = () =>
  useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      const { data } = await api.post<AuthResponse>('/auth/login', { username, password });
      return data;
    },
  });

export const fetchProfile = async () => {
  const { data } = await api.get<{ user: AuthResponse['user'] }>('/auth/me');
  return data.user;
};
