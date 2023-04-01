import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import {
	Box,
	Divider,
	Drawer,
	IconButton,
	Input,
	InputAdornment,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	ListSubheader,
} from '@mui/material';
import {
	AccountCircleOutlined,
	AdminPanelSettings,
	CategoryOutlined,
	ConfirmationNumberOutlined,
	DashboardOutlined,
	EscalatorWarningOutlined,
	FemaleOutlined,
	LoginOutlined,
	MaleOutlined,
	SearchOutlined,
	VpnKeyOutlined,
} from '@mui/icons-material';
import { AuthContext, UiContext } from '../../context';

export const SideMenu = () => {
	const router = useRouter();
	const { isMenuOpen, toggleSideMenu } = useContext(UiContext);
	const { isLoggedIn, user, logout } = useContext(AuthContext);
	const [searchTerm, setSearchTerm] = useState('');

	const onSearchTerm = () => {
		if (searchTerm.trim().length === 0) return;
		navigateTo(`/search/${searchTerm}`);
	};

	const navigateTo = (url: string) => {
		router.push(url);
		toggleSideMenu();
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
		<Drawer
			onBackdropClick={() => toggleSideMenu()}
			open={isMenuOpen}
			anchor='right'
			sx={{ backdropFilter: 'blur(4px)', transition: 'all 0.5s ease-out' }}>
			<Box sx={{ width: 250, paddingTop: 5 }}>
				<List>
					<ListItem>
						<Input
							{...textFieldProps}
							value={searchTerm}
							onChange={e => setSearchTerm(e.target.value)}
							onKeyPress={e => (e.key === 'Enter' ? onSearchTerm() : null)}
							type='text'
							placeholder='Buscar...'
							endAdornment={
								<InputAdornment position='end'>
									<IconButton onClick={onSearchTerm}>
										<SearchOutlined />
									</IconButton>
								</InputAdornment>
							}
						/>
					</ListItem>
					{isLoggedIn && (
						<>
							<ListItemButton>
								<ListItemIcon>
									<AccountCircleOutlined />
								</ListItemIcon>
								<ListItemText primary={'Perfil'} />
							</ListItemButton>

							<ListItemButton onClick={() => navigateTo('/orders/history')}>
								<ListItemIcon>
									<ConfirmationNumberOutlined />
								</ListItemIcon>
								<ListItemText primary={'Mis Ordenes'} />
							</ListItemButton>
						</>
					)}

					<ListItemButton sx={{ display: { sm: 'none' } }}>
						<ListItemIcon>
							<MaleOutlined />
						</ListItemIcon>
						<ListItemText
							onClick={() => navigateTo('/category/men')}
							primary={'Hombres'}
						/>
					</ListItemButton>

					<ListItemButton sx={{ display: { sm: 'none' } }}>
						<ListItemIcon>
							<FemaleOutlined />
						</ListItemIcon>
						<ListItemText
							onClick={() => navigateTo('/category/women')}
							primary={'Mujeres'}
						/>
					</ListItemButton>

					<ListItemButton sx={{ display: { sm: 'none' } }}>
						<ListItemIcon>
							<EscalatorWarningOutlined />
						</ListItemIcon>
						<ListItemText
							onClick={() => navigateTo('/category/kids')}
							primary={'Niños'}
						/>
					</ListItemButton>

					{isLoggedIn ? (
						<ListItemButton onClick={logout}>
							<ListItemIcon>
								<LoginOutlined />
							</ListItemIcon>
							<ListItemText primary={'Salir'} />
						</ListItemButton>
					) : (
						<ListItem
							button
							onClick={() => navigateTo(`/auth/login?p=${router.asPath}`)}>
							<ListItemIcon>
								<VpnKeyOutlined />
							</ListItemIcon>
							<ListItemText primary={'Ingresar'} />
						</ListItem>
					)}

					{/* Admin */}
					{user?.role === 'admin' && (
						<>
							<Divider />
							<ListSubheader>Admin Panel</ListSubheader>

							<ListItemButton onClick={() => navigateTo('/admin/dashboard')}>
								<ListItemIcon>
									<DashboardOutlined />
								</ListItemIcon>
								<ListItemText primary={'Dashboard'} />
							</ListItemButton>

							<ListItemButton onClick={() => navigateTo('/admin/products')}>
								<ListItemIcon>
									<CategoryOutlined />
								</ListItemIcon>
								<ListItemText primary={'Productos'} />
							</ListItemButton>

							<ListItemButton onClick={() => navigateTo('/admin/orders')}>
								<ListItemIcon>
									<ConfirmationNumberOutlined />
								</ListItemIcon>
								<ListItemText primary={'Ordenes'} />
							</ListItemButton>

							<ListItemButton onClick={() => navigateTo('/admin/users')}>
								<ListItemIcon>
									<AdminPanelSettings />
								</ListItemIcon>
								<ListItemText primary={'Usuarios'} />
							</ListItemButton>
						</>
					)}
				</List>
			</Box>
		</Drawer>
	);
};
