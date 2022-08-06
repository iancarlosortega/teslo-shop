import { useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { PayPalButtons } from '@paypal/react-paypal-js';
import {
	Box,
	Card,
	CardContent,
	Chip,
	CircularProgress,
	Divider,
	Grid,
	Typography,
} from '@mui/material';
import {
	CreditCardOffOutlined,
	CreditScoreOutlined,
} from '@mui/icons-material';
import { CartList, OrdenSummary } from '../../components/cart';
import { ShopLayout } from '../../components/layouts';
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces';
import { tesloApi } from '../../api';

export type OrderResponseBody = {
	id: string;
	status:
		| 'COMPLETED'
		| 'SAVED'
		| 'APPROVED'
		| 'VOIDED'
		| 'PAYER_ACTION_REQUIRED';
};

interface Props {
	order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }) => {
	const router = useRouter();
	const { _id, isPaid, numberOfItems, orderItems, subTotal, tax, total } =
		order;
	const { firstName, lastName, address, address2, city, country, zip, phone } =
		order.shippingAddress;
	const [isPaying, setIsPaying] = useState(false);

	const onOrderCompleted = async (details: OrderResponseBody) => {
		if (details.status !== 'COMPLETED') {
			return alert('No hay pago en Paypal');
		}

		setIsPaying(true);

		try {
			const { data } = await tesloApi.post(`/orders/pay`, {
				transactionId: details.id,
				orderId: order._id,
			});

			router.reload();
		} catch (error) {
			console.log(error);
			alert('Error');
			setIsPaying(false);
		}
	};

	return (
		<ShopLayout
			title={`Resumen de la Orden ${_id}`}
			pageDescription={`Resumen de la Orden ${_id}`}>
			<Typography variant='h1' component='h1'>
				Orden: {_id}
			</Typography>

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
								<Box
									display='flex'
									justifyContent='center'
									className='fadeIn'
									sx={{ display: isPaying ? 'flex' : 'none' }}>
									<CircularProgress color='primary' />
								</Box>
								<Box
									sx={{ display: isPaying ? 'none' : 'flex', flex: 1 }}
									flexDirection='column'>
									{isPaid ? (
										<Chip
											sx={{ my: 2 }}
											label='Orden ya fue pagada'
											variant='outlined'
											color='success'
											icon={<CreditScoreOutlined />}
										/>
									) : (
										<PayPalButtons
											createOrder={(data, actions) => {
												return actions.order.create({
													purchase_units: [
														{
															amount: {
																value: `${order.total}`,
															},
														},
													],
												});
											}}
											onApprove={(data, actions) => {
												return actions.order!.capture().then(details => {
													onOrderCompleted(details);
												});
											}}
										/>
									)}
								</Box>
							</Box>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</ShopLayout>
	);
};

export const getServerSideProps: GetServerSideProps = async ({
	req,
	query,
}) => {
	const { id = '' } = query;

	// Verificar que el usuario esté autenticado
	const session: any = await getSession({ req });
	if (!session) {
		return {
			redirect: {
				destination: `/auth/login?p=/orders/${id}`,
				permanent: false,
			},
		};
	}

	// Verificar que la orden exista en la base de datos
	const order = await dbOrders.getOrderByID(id.toString());
	if (!order) {
		return {
			redirect: {
				destination: '/orders/history',
				permanent: false,
			},
		};
	}

	// Verificar que la orden pertenece al mismo usuario
	if (order.user !== session.user._id) {
		return {
			redirect: {
				destination: '/orders/history',
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
