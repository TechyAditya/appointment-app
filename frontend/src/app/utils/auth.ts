import { useMutation, UseMutationResult } from '@tanstack/react-query';

type LoginData = {
    email: string;
    password: string;
};

type LoginResponse = {
    token: string;
};

const login = async ({ email, password }: LoginData): Promise<LoginResponse> => {
    const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
        throw new Error('Login failed');
    }
    return response.json();
};

export const useLogin = (): UseMutationResult<LoginResponse, Error, LoginData> => {
    return useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            document.cookie = `token=${data.token}; path=/`;
        },
    });
};
