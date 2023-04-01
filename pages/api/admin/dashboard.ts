import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database';
import { Order, Product, User } from '../../../models';

type Data =
	| any
	| {
			numberOfOrders: number;
			paidOrders: number;
			notPaidOrders: number;
			numberOfClients: number;
			numberOfProducts: number;
			productsWithNoInventory: number;
			productsWithLowInventory: number;
	  };

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	await db.connect();

	const [orders, users, products] = await Promise.all([
		Order.find().lean(),
		User.find().lean(),
		Product.find().lean(),
	]);

	await db.disconnect();
	const numberOfOrders = orders.length;
	const paidOrders = orders.filter(order => order.isPaid).length;
	const notPaidOrders = numberOfOrders - paidOrders;
	const numberOfClients = users.filter(user => user.role === 'client').length;
	const numberOfProducts = products.length;
	const productsWithNoInventory = products.filter(
		product => product.inStock === 0
	).length;
	const productsWithLowInventory = products.filter(
		product => product.inStock <= 10
	).length;

	res.status(200).json({
		numberOfOrders,
		paidOrders,
		notPaidOrders,
		numberOfClients,
		numberOfProducts,
		productsWithNoInventory,
		productsWithLowInventory,
	});
}
