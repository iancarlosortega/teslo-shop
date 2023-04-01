import { GetServerSideProps, NextPage } from 'next';
import {
	Box,
	Card,
	CardContent,
	Chip,
	Divider,
	Grid,
	Typography,
} from '@mui/material';
import {
	ConfirmationNumberOutlined,
	CreditCardOffOutlined,
	CreditScoreOutlined,
} from '@mui/icons-material';
import { CartList, OrdenSummary } from '../../../components/cart';
import { AdminLayout } from '../../../components/layouts';
import { dbOrders } from '../../../database';
import { IOrder } from '../../../interfaces';

interface Props {
	order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }) => {
	const { _id, isPaid, numberOfItems, orderItems, subTotal, tax, total } =
		order;
	const { firstName, lastName, address, address2, city, country, zip, phone } =
		order.shippingAddress;

	return (
		<AdminLayout
			title='Resumen de la Orden'
			subTitle={`OrdenID: ${_id}`}
			icon={<ConfirmationNumberOutlined />}>
			{isPaid ? (
				<Chip
					sx={{ my: 2 }}
					label='Orden ya fue pagada'
					variant='outlined'
					color='success'
					icon={<CreditScoreOutlined />}
				/>
			) : (
				<Chip
					sx={{ my: 2 }}
					label='Pendiente de pago'
					variant='outlined'
					color='error'
					icon={<CreditCardOffOutlined />}
				/>
			)}

			<Grid container className='fadeIn'>
				<Grid item xs={12} sm={7}>
					<CartList products={orderItems} />
				</Grid>
				<Grid item xs={12} sm={5}>
					<Card className='summary-card'>
						<CardContent>
							<Typography variant='h2'>
								Resumen ({numberOfItems}{' '}
								{numberOfItems > 1 ? 'productos' : 'producto'})
							</Typography>
							<Divider sx={{ my: 1 }} />

							<Box display='flex' justifyContent='space-between'>
								<Typography variant='subtitle1'>
									Dirección de entrega
								</Typography>
							</Box>

							<Typography>
								{firstName} {lastName}
							</Typography>
							<Typography>
								{address}
								{address2 ? `, ${address2}` : ''}
							</Typography>
							<Typography>
								{city}, {zip}
							</Typography>
							<Typography>{country}</Typography>
							<Typography>{phone}</Typography>

							<Divider sx={{ my: 1 }} />

							<OrdenSummary
								orderValues={{
									numberOfItems,
									tax,
									subTotal,
									total,
								}}
							/>

							<Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
								{isPaid ? (
									<Chip
										sx={{ my: 2 }}
										label='Orden ya fue pagada'
										variant='outlined'
										color='success'
										icon={<CreditScoreOutlined />}
									/>
								) : (
									<Chip
										sx={{ my: 2 }}
										label='Pendiente de pago'
										variant='outlined'
										color='error'
										icon={<CreditCardOffOutlined />}
									/>
								)}
							</Box>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</AdminLayout>
	);
};

export const getServerSideProps: GetServerSideProps = async ({
	req,
	query,
}) => {
	const { id = '' } = query;

	// Verificar que la orden exista en la base de datos
	const order = await dbOrders.getOrderByID(id.toString());
	if (!order) {
		return {
			redirect: {
				destination: '/admin/orders',
				permanent: false,
			},
		};
	}

	return {
		props: {
			order,
		},
	};
};

export default OrderPage;
