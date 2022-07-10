import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database';
import { IProduct } from '../../../interfaces';
import { Product } from '../../../models';

type Data = { message: string } | IProduct;

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	switch (req.method) {
		case 'GET':
			return getProductBySlug(req, res);

		default:
			return res.status(400).json({
				message: 'El método no existe',
			});
	}
}

const getProductBySlug = async (
	req: NextApiRequest,
	res: NextApiResponse<Data>
) => {
	const { slug } = req.query;
	console.log(slug);
	await db.connect();
	const productBySlug = await Product.findOne({ slug }).lean();
	await db.disconnect();

	if (!productBySlug) {
		return res.status(404).json({
			message: 'No existe una producto con ese slug ' + slug,
		});
	}

	return res.status(200).json(productBySlug);
};
