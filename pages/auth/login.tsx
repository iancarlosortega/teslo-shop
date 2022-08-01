import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { getSession, signIn, getProviders } from 'next-auth/react';
import NextLink from 'next/link';
import {
	Box,
	Button,
	Chip,
	Divider,
	Grid,
	Link,
	TextField,
	Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import { AuthLayout } from '../../components/layouts';
// import { AuthContext } from '../../context';
import { useForm } from 'react-hook-form';
import { validations } from '../../utils';
import { ErrorOutline } from '@mui/icons-material';

type FormData = {
	email: string;
	password: string;
};

const LoginPage = () => {
	const router = useRouter();
	// const { loginUser } = useContext(AuthContext);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>();

	const [showError, setShowError] = useState(false);
	const [providers, setProviders] = useState<any>({});

	useEffect(() => {
		getProviders().then(prov => {
			+setProviders(prov);
		});
	}, []);

	const onLoginUser = async ({ email, password }: FormData) => {
		setShowError(false);
		await signIn('credentials', { email, password });
		//Autenticacion personalizada
		// const isValidLogin = await loginUser(email, password);
		// if (!isValidLogin) {
		// 	setShowError(true);
		// 	setTimeout(() => {
		// 		setShowError(false);
		// 	}, 3000);
		// 	return;
		// }

		// const destination = router.query.p?.toString() || '/';
		// router.replace(destination);
	};

	return (
		<AuthLayout title='Ingresar'>
			<form onSubmit={handleSubmit(onLoginUser)}>
				<Box sx={{ width: 400, padding: '10px 20px' }}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<Typography variant='h1' component='h1'>
								Iniciar Sesión
							</Typography>
							<Chip
								sx={{ display: showError ? 'flex' : 'none' }}
								label='Correo o contraseña incorrectos'
								color='error'
								icon={<ErrorOutline />}
								className='fadeIn'
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
									// validate: (valor) => validations.isEmail(valor),
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
									minLength: { value: 6, message: 'Mínimo 6 caracteres' },
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
								Ingresar
							</Button>
						</Grid>
						<Grid item xs={12} display='flex' justifyContent='end'>
							<NextLink
								href={
									router.query.p
										? `/auth/register?p=${router.query.p?.toString()}`
										: '/auth/register'
								}
								passHref>
								<Link underline='always'>¿No tienes cuenta?</Link>
							</NextLink>
						</Grid>

						{/* Providers */}
						<Grid
							item
							xs={12}
							display='flex'
							flexDirection='column'
							justifyContent='end'>
							<Divider sx={{ width: '100%', mb: 2 }} />
							{Object.values(providers).map((provider: any) => {
								if (provider.id === 'credentials')
									return <div key='credentials'></div>;

								return (
									<Button
										key={provider.id}
										variant='outlined'
										fullWidth
										color='primary'
										sx={{ mb: 1 }}
										onClick={() => signIn(provider.id)}>
										{provider.name}
									</Button>
								);
							})}
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

export default LoginPage;
