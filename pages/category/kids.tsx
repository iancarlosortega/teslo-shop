import { Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts';
import { ProductList } from '../../components/products';
import { FullScreenLoading } from '../../components/ui';
import { useProducts } from '../../hooks';

const KidsPage = () => {
	const { products, isLoading } = useProducts('/products?gender=kid');

	return (
		<ShopLayout
			title='TesloShop - Kids'
			pageDescription='Encuentra los mejores productos para niños aquí'>
			<Typography variant='h1' component='h1'>
				Niños
			</Typography>
			<Typography variant='h2' sx={{ mb: 1 }}>
				Productos para niños
			</Typography>
			{isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
		</ShopLayout>
	);
};

export default KidsPage;
