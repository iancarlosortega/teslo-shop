import NextLink from 'next/link';
import { RemoveShoppingCartOutlined } from '@mui/icons-material';
import { Box, Link, Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts';

const EmptyPage = () => {
	return (
		<ShopLayout
			title='Teslo | Carrito Vacío'
			pageDescription='No hay nada en el carrito de compras'>
			<Box
				sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
				display='flex'
				justifyContent='center'
				alignItems='center'
				height='calc(100vh - 200px)'>
				<RemoveShoppingCartOutlined sx={{ fontSize: 100 }} />
				<Box display='flex' flexDirection='column' alignItems='center'>
					<Typography>Su carrito está vacío</Typography>
					<Link href='/' component={NextLink} typography='h4' color='secondary'>
						Regresar
					</Link>
				</Box>
			</Box>
		</ShopLayout>
	);
};

export default EmptyPage;
