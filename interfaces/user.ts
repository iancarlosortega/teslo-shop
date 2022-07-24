export interface IUser {
	_id: string;
	name: string;
	email: string;
	password?: string;
	role: IUserRole;
	createdAt?: string;
	updatedAt?: string;
}

type IUserRole = 'admin' | 'client';
