import { useState } from 'react';
import {
	NextPage,
	GetServerSideProps,
	GetStaticPaths,
	GetStaticProps,
} from 'next';
import { Box, Button, Chip, Grid, Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts';
import { ProductSlideshow, SizeSelector } from '../../components/products';
import { ItemCounter } from '../../components/ui';
import { dbProducts } from '../../database';
import { ICartProduct, IProduct, ISize } from '../../interfaces';

interface Props {
	product: IProduct;
}

const ProductPage: NextPage<Props> = ({ product }) => {
	// No se recomienda utilizar este método, ya que no hay SEO
	// const router = useRouter();
	// const { products: product, isLoading } = useProducts(`/products/${ router.query.slug }`);

	const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
		_id: product._id,
		image: product.images[0],
		price: product.price,
		size: undefined,
		slug: product.slug,
		title: product.title,
		gender: product.gender,
		quantity: 1,
	});

	const onSelectedSize = (size: ISize) => {
		setTempCartProduct(currentProduct => ({
			...currentProduct,
			size,
		}));
	};

	const onUpdatedQuantity = (quantity: number) => {
		setTempCartProduct(currentProduct => ({
			...currentProduct,
			quantity,
		}));
	};

	const onAddedProduct = () => {
		console.log(tempCartProduct);
	};
	return (
		<ShopLayout title={product.title} pageDescription={product.description}>
			<Grid container spacing={3}>
				<Grid item xs={12} sm={7}>
					<ProductSlideshow images={product.images} />
				</Grid>
				<Grid item xs={12} sm={5}>
					<Box display='flex' flexDirection='column'>
						<Typography variant='h1' component='h1'>
							{product.title}
						</Typography>
						<Typography variant='subtitle1' component='h2'>
							${product.price}
						</Typography>

						<Box sx={{ my: 2 }}>
							<Typography variant='subtitle2'>Cantidad</Typography>
							<ItemCounter
								currentValue={tempCartProduct.quantity}
								maxValue={product.inStock}
								updatedQuantity={onUpdatedQuantity}
							/>
							<SizeSelector
								onSelectedSize={onSelectedSize}
								selectedSize={tempCartProduct.size}
								sizes={product.sizes}
							/>
						</Box>

						{product.inStock > 0 ? (
							<Button
								onClick={onAddedProduct}
								color='secondary'
								className='circular-btn'>
								{tempCartProduct.size
									? 'Agregar al carrito'
									: 'Seleccione una talla'}
							</Button>
						) : (
							<Chip
								label='No hay disponibles'
								color='error'
								variant='outlined'
							/>
						)}

						<Box sx={{ mt: 3 }}>
							<Typography variant='subtitle2'>Descripción</Typography>
							<Typography variant='body2'>{product.description}</Typography>
						</Box>
					</Box>
				</Grid>
			</Grid>
		</ShopLayout>
	);
};

// Get Products with SSR

// export const getServerSideProps: GetServerSideProps = async ({ params }) => {
// 	const { slug = '' } = params as { slug: string };
// 	const product = await getProductBySlug(slug);

// 	if (!product) {
// 		return {
// 			redirect: {
// 				destination: '/',
// 				permanent: false,
// 			},
// 		};
// 	}

// 	return {
// 		props: {
// 			product,
// 		},
// 	};
// };

export const getStaticPaths: GetStaticPaths = async ctx => {
	const slugs = await dbProducts.getAllProductsSlug();

	return {
		paths: slugs.map(slug => ({
			params: { slug },
		})),
		fallback: 'blocking',
	};
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const { slug = '' } = params as { slug: string };
	const product = await dbProducts.getProductBySlug(slug);

	if (!product) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}

	return {
		props: {
			product,
		},
		revalidate: 86400,
	};
};

export default ProductPage;
