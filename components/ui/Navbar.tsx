import { useContext, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import {
	AppBar,
	Badge,
	Box,
	Button,
	IconButton,
	Input,
	InputAdornment,
	Link,
	Toolbar,
	Typography,
} from '@mui/material';
import {
	ClearOutlined,
	SearchOutlined,
	ShoppingCartOutlined,
} from '@mui/icons-material';
import { UiContext } from '../../context';

export const Navbar = () => {
	const { pathname, push } = useRouter();
	const { toggleSideMenu } = useContext(UiContext);
	const [searchTerm, setSearchTerm] = useState('');
	const [isSearchOpen, setIsSearchOpen] = useState(false);

	const onSearchTerm = () => {
		if (searchTerm.trim().length === 0) return;
		push(`/search/${searchTerm}`);
	};

	// Autofocus
	const textFieldInputFocus = (inputRef: any) => {
		if (inputRef && inputRef.node !== null) {
			setTimeout(() => {
				inputRef.focus();
			}, 100);
		}
		return inputRef;
	};
	let textFieldProps = { inputRef: textFieldInputFocus };

	return (
		<AppBar>
			<Toolbar>
				<NextLink href='/' passHref>
					<Link display='flex' alignItems='center'>
						<Typography variant='h6'>Teslo |</Typography>
						<Typography sx={{ ml: 0.5 }}>Shop</Typography>
					</Link>
				</NextLink>

				<Box flex={1} />

				<Box
					className='fadeIn'
					sx={{ display: isSearchOpen ? 'none' : { xs: 'none', sm: 'block' } }}>
					<NextLink href='/category/men' passHref>
						<Link>
							<Button color={pathname == '/category/men' ? 'primary' : 'info'}>
								Hombres
							</Button>
						</Link>
					</NextLink>
					<NextLink href='/category/women' passHref>
						<Link>
							<Button
								color={pathname === '/category/women' ? 'primary' : 'info'}>
								Mujeres
							</Button>
						</Link>
					</NextLink>
					<NextLink href='/category/kids' passHref>
						<Link>
							<Button
								color={pathname === '/category/kids' ? 'primary' : 'info'}>
								Niños
							</Button>
						</Link>
					</NextLink>
				</Box>

				<Box flex={1} />

				{/* Pantallas grandes */}
				{isSearchOpen ? (
					<Input
						sx={{
							display: { xs: 'none', sm: 'flex' },
						}}
						className='fadeIn'
						{...textFieldProps}
						value={searchTerm}
						onChange={e => setSearchTerm(e.target.value)}
						onKeyPress={e => (e.key === 'Enter' ? onSearchTerm() : null)}
						type='text'
						placeholder='Buscar...'
						endAdornment={
							<InputAdornment position='end'>
								<IconButton onClick={() => setIsSearchOpen(false)}>
									<ClearOutlined />
								</IconButton>
							</InputAdornment>
						}
					/>
				) : (
					<IconButton
						sx={{
							display: { xs: 'none', sm: 'flex' },
						}}
						className='fadeIn'
						onClick={() => setIsSearchOpen(true)}>
						<SearchOutlined />
					</IconButton>
				)}

				{/* Pantallas pequeñas */}
				<IconButton
					sx={{ display: { xs: 'block', sm: 'none' } }}
					onClick={toggleSideMenu}>
					<SearchOutlined />
				</IconButton>

				<NextLink href='cart' passHref>
					<Link>
						<IconButton>
							<Badge badgeContent={2} color='secondary'>
								<ShoppingCartOutlined />
							</Badge>
						</IconButton>
					</Link>
				</NextLink>

				<Button onClick={toggleSideMenu}>Menú</Button>
			</Toolbar>
		</AppBar>
	);
};
