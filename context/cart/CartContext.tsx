import { createContext } from 'react';
import { ShippingAdress } from './';
import { ICartProduct } from '../../interfaces';

interface ContextProps {
	isLoaded: boolean;
	cart: ICartProduct[];
	numberOfItems: number;
	subTotal: number;
	tax: number;
	total: number;
	shippingAddress?: ShippingAdress;
	addProductToCart: (product: ICartProduct) => void;
	updateCartQuantity: (product: ICartProduct) => void;
	removeCartProduct: (product: ICartProduct) => void;
	updateAddress: (address: ShippingAdress) => void;
}

export const CartContext = createContext({} as ContextProps);
