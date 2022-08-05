import { FC, useContext } from 'react';
import { Grid, Typography } from '@mui/material';
import { CartContext } from '../../context';
import { currency } from '../../utils';

interface Props {
	orderValues?: {
		numberOfItems: number;
		subTotal: number;
		tax: number;
		total: number;
	};
}

export const OrdenSummary: FC<Props> = ({ orderValues }) => {
	const { numberOfItems, subTotal, tax, total } = useContext(CartContext);
	const summaryValues = orderValues
		? orderValues
		: { numberOfItems, subTotal, tax, total };

	return (
		<Grid container>
			<Grid item xs={6}>
				<Typography>No. Productos</Typography>
			</Grid>
			<Grid item xs={6} display='flex' justifyContent='end'>
				<Typography>
					{summaryValues.numberOfItems}{' '}
					{summaryValues.numberOfItems > 1 ? 'productos' : 'producto'}
				</Typography>
			</Grid>
			<Grid item xs={6}>
				<Typography>Subtotal</Typography>
			</Grid>
			<Grid item xs={6} display='flex' justifyContent='end'>
				<Typography>{currency.format(summaryValues.subTotal)}</Typography>
			</Grid>
			<Grid item xs={6}>
				<Typography>
					Impuestos ({Number(process.env.NEXT_PUBLIC_TAX_RATE || 0) * 100}%)
				</Typography>
			</Grid>
			<Grid item xs={6} display='flex' justifyContent='end'>
				<Typography>{currency.format(summaryValues.tax)}</Typography>
			</Grid>
			<Grid item xs={6} sx={{ mt: 3 }}>
				<Typography variant='subtitle1'>Total:</Typography>
			</Grid>
			<Grid item xs={6} sx={{ mt: 3 }} display='flex' justifyContent='end'>
				<Typography variant='subtitle1'>
					{currency.format(summaryValues.total)}
				</Typography>
			</Grid>
		</Grid>
	);
};
