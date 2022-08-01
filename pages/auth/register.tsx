import { useContext, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { getSession, signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import {
	Box,
	Button,
	Chip,
	Grid,
	Link,
	TextField,
	Typography,
} from '@mui/material';
import { AuthLayout } from '../../components/layouts';
import { AuthContext } from '../../context';
import { validations } from '../../utils';
import { ErrorOutline } from '@mui/icons-material';

type FormData = {
	name: string;
	email: string;
	password: string;
};

const RegisterPage = () => {
	const { registerUser } = useContext(AuthContext);
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>();

	const [showError, setShowError] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	const onRegisterUser = async ({ email, password, name }: FormData) => {
		setShowError(false);
		const { hasError, message } = await registerUser(email, password, name);
		if (hasError) {
			setShowError(true);
			setErrorMessage(message!);
			setTimeout(() => {
				setShowError(false);
				setErrorMessage('');
			}, 3000);
			return;
		}

		// const destination = router.query.p?.toString() || '/';
		// router.replace(destination);

		await signIn('credentials', { email, password });
	};

	return (
		<AuthLayout title='Crear Cuenta'>
			<form onSubmit={handleSubmit(onRegisterUser)}>
				<Box sx={{ width: 400, padding: '10px 20px' }}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<Typography variant='h1' component='h1'>
								Crear cuenta
							</Typography>
							<Chip
								sx={{ display: showError ? 'flex' : 'none' }}
								label={errorMessage}
								color='error'
								icon={<ErrorOutline />}
								className='fadeIn'
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								label='Nombre Completo'
								variant='filled'
								fullWidth
								{...register('name', {
									required: 'Este campo es requerido',
									minLength: {
										value: 2,
										message: 'Mínimo 2 caracteres',
									},
								})}
								error={!!errors.name}
								helperText={errors.name?.message}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								type='email'
								label='Correo'
								variant='filled'
								fullWidth
								{...register('email', {
									required: 'Este campo es requerido',
									validate: validations.isEmail,
								})}
								error={!!errors.email}
								helperText={errors.email?.message}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								label='Contraseña'
								type='password'
								variant='filled'
								fullWidth
								{...register('password', {
									required: 'Este campo es requerido',
									minLength: {
										value: 6,
										message: 'Mínimo 6 caracteres',
									},
								})}
								error={!!errors.password}
								helperText={errors.password?.message}
							/>
						</Grid>
						<Grid item xs={12}>
							<Button
								type='submit'
								color='secondary'
								className='circular-btn'
								size='large'
								fullWidth>
								Registrase
							</Button>
						</Grid>
						<Grid item xs={12} display='flex' justifyContent='end'>
							<NextLink
								href={
									router.query.p
										? `/auth/login?p=${router.query.p?.toString()}`
										: '/auth/login'
								}
								passHref>
								<Link underline='always'>¿Ya tienes una cuenta?</Link>
							</NextLink>
						</Grid>
					</Grid>
				</Box>
			</form>
		</AuthLayout>
	);
};

export const getServerSideProps: GetServerSideProps = async ({
	req,
	query,
}) => {
	const session = await getSession({ req });
	const { p = '/' } = query;

	if (session) {
		return {
			redirect: {
				destination: p.toString(),
				permanent: false,
			},
		};
	}

	return {
		props: {},
	};
};

export default RegisterPage;
