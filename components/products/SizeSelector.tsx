import { FC } from 'react';
import { Box, Button } from '@mui/material';
import { ISize } from '../../interfaces';

interface Props {
	onSelectedSize: (size: ISize) => void;
	selectedSize?: ISize;
	sizes: ISize[];
}

export const SizeSelector: FC<Props> = ({
	selectedSize,
	sizes,
	onSelectedSize,
}) => {
	return (
		<Box>
			{sizes.map(size => (
				<Button
					onClick={() => onSelectedSize(size)}
					key={size}
					size='small'
					color={selectedSize === size ? 'primary' : 'info'}>
					{size}
				</Button>
			))}
		</Box>
	);
};
