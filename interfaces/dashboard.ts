export interface DashboardSumaryResponse {
	numberOfOrders: number;
	paidOrders: number;
	notPaidOrders: number;
	numberOfClients: number;
	numberOfProducts: number;
	productsWithNoInventory: number;
	productsWithLowInventory: number;
}
