import { GetServerSideProps, NextPage } from 'next';
import NextLink from 'next/link';
import { Chip, Grid, Link, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { ShopLayout } from '../../components/layouts';
import { getSession } from 'next-auth/react';
import { dbOrders } from '../../database';

const columns: GridColDef[] = [
	{ field: 'id', headerName: 'ID', width: 100 },
	{ field: 'fullName', headerName: 'Nombre Completo', width: 300 },
	{
		field: 'paid',
		headerName: 'Pagada',
		description: 'Muestra información si está pagada la orden o no',
		width: 200,
		renderCell: (params: GridRenderCellParams) => {
			return params.row.paid ? (
				<Chip color='success' label='Pagada' variant='outlined' />
			) : (
				<Chip color='error' label='No Pagada' variant='outlined' />
			);
		},
	},
	{
		field: 'orden',
		headerName: 'Ver Orden',
		width: 200,
		sortable: false,
		renderCell: (params: GridRenderCellParams) => {
			return (
				<Link
					href={`${params.row.orderId}`}
					component={NextLink}
					underline='always'>
					Ver Orden
				</Link>
			);
		},
	},
];

interface Props {
	orders: {
		id: number;
		paid: boolean;
		fullName: string;
		orderId: string;
	}[];
}

const HistoryPage: NextPage<Props> = ({ orders }) => {
	return (
		<ShopLayout
			title='Historial de ordenes'
			pageDescription='Historial de ordenes del cliente'>
			<Typography variant='h1' component='h1'>
				Historial de ordenes
			</Typography>
			<Grid container className='fadeIn'>
				<Grid item xs={12} sx={{ height: 650, width: '100%' }}>
					<DataGrid
						rows={orders}
						columns={columns}
						autoPageSize={true}
						pageSizeOptions={[5, 10, 25]}
					/>
				</Grid>
			</Grid>
		</ShopLayout>
	);
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	// Verificar que el usuario esté autenticado
	const session: any = await getSession({ req });
	if (!session) {
		return {
			redirect: {
				destination: `/auth/login?p=/orders/history`,
				permanent: false,
			},
		};
	}
	const orders = await dbOrders.getOrdersByUser(session.user._id);

	return {
		props: {
			orders: orders
				? orders.map(({ _id, isPaid, shippingAddress }, index) => ({
						id: index + 1,
						paid: isPaid,
						fullName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
						orderId: _id,
				  }))
				: [],
		},
	};
};

export default HistoryPage;
