import { FC, ReactNode, useEffect, useReducer } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Cookies from 'js-cookie';
import { tesloApi } from '../../api';
import { IUser } from '../../interfaces';
import { AuthContext, authReducer } from './';
import { signOut, useSession } from 'next-auth/react';

export interface AuthState {
	isLoggedIn: boolean;
	user?: IUser;
}

const AUTH_INITIAL_STATE: AuthState = {
	isLoggedIn: false,
	user: undefined,
};

interface Props {
	children?: ReactNode;
}

export const AuthProvider: FC<Props> = ({ children }) => {
	const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE);
	const router = useRouter();
	const { data, status } = useSession();

	useEffect(() => {
		if (status === 'authenticated') {
			dispatch({ type: '[Auth] - Login', payload: data.user as IUser });
		}
	}, [status, data]);

	// Autenticación personalizada
	// useEffect(() => {
	// 	checkToken();
	// }, []);

	// const checkToken = async () => {
	// 	if (!Cookies.get('token')) return;
	// 	try {
	// 		const { data } = await tesloApi.get('/user/validate-token');
	// 		const { token, user } = data;
	// 		Cookies.set('token', token);
	// 		dispatch({ type: '[Auth] - Login', payload: user });
	// 	} catch (error) {
	// 		Cookies.remove('token');
	// 	}
	// };

	const loginUser = async (
		email: string,
		password: string
	): Promise<boolean> => {
		try {
			const { data } = await tesloApi.post('/user/login', { email, password });
			const { token, user } = data;
			Cookies.set('token', token);
			dispatch({ type: '[Auth] - Login', payload: user });
			return true;
		} catch (error) {
			return false;
		}
	};

	const registerUser = async (
		email: string,
		password: string,
		name: string
	): Promise<{ hasError: boolean; message?: string }> => {
		try {
			const { data } = await tesloApi.post('/user/register', {
				email,
				password,
				name,
			});
			const { token, user } = data;
			Cookies.set('token', token);
			dispatch({ type: '[Auth] - Login', payload: user });
			return {
				hasError: false,
			};
		} catch (err) {
			if (axios.isAxiosError(err)) {
				const { message } = err.response?.data as { message: string };
				return {
					hasError: true,
					message,
				};
			}

			return {
				hasError: true,
				message: 'No se pudo crear el usuario',
			};
		}
	};

	const logout = () => {
		Cookies.remove('cart');
		Cookies.remove('firstName');
		Cookies.remove('lastName');
		Cookies.remove('address');
		Cookies.remove('address2');
		Cookies.remove('zip');
		Cookies.remove('city');
		Cookies.remove('country');
		Cookies.remove('phone');
		signOut();

		// Autenticacion personalizada
		// Cookies.remove('token');
		// router.reload();
	};

	return (
		<AuthContext.Provider value={{ ...state, loginUser, registerUser, logout }}>
			{children}
		</AuthContext.Provider>
	);
};
