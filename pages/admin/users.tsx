import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { tesloApi } from '../../api';
import { Grid, MenuItem, Select } from '@mui/material';
import { PeopleOutline } from '@mui/icons-material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { AdminLayout } from '../../components/layouts';
import { FullScreenLoading } from '../../components/ui';
import { IUser } from '../../interfaces';

const UsersPage = () => {
	const { data, error } = useSWR<IUser[]>('/api/admin/users');
	const [users, setUsers] = useState<IUser[]>([]);

	useEffect(() => {
		if (data) {
			setUsers(data);
		}
	}, [data]);

	if (!data && !error) return <FullScreenLoading />;

	const onRoleUpdated = async (userId: string, newRole: string) => {
		const previousUsers = users.map(user => ({ ...user }));

		const updatedUsers: any = users.map(user => ({
			...user,
			role: userId === user._id ? newRole : user.role,
		}));

		setUsers(updatedUsers);

		try {
			await tesloApi.put('/admin/users', {
				userId,
				role: newRole,
			});
		} catch (error) {
			setUsers(previousUsers);
			console.log(error);
			alert('No se pudo actualizar el role de usuario');
		}
	};

	const columns: GridColDef[] = [
		{
			field: 'email',
			headerName: 'Correo',
			width: 250,
		},
		{
			field: 'name',
			headerName: 'Nombre completo',
			width: 300,
		},
		{
			field: 'role',
			headerName: 'Rol',
			width: 300,
			renderCell: ({ row }: GridValueGetterParams) => {
				return (
					<Select
						value={row.role}
						label='Rol'
						onChange={({ target }) => onRoleUpdated(row.id, target.value)}
						sx={{ width: '300px' }}>
						<MenuItem value='admin'>Admin</MenuItem>
						<MenuItem value='client'>Cliente</MenuItem>
					</Select>
				);
			},
		},
	];

	const rows = users.map(user => ({
		id: user._id,
		email: user.email,
		name: user.name,
		role: user.role,
	}));

	return (
		<AdminLayout
			title='Usuarios'
			subTitle='Mantenimiento de usuarios'
			icon={<PeopleOutline />}>
			<Grid container className='fadeIn'>
				<Grid item xs={12} sx={{ height: 650, width: '100%' }}>
					<DataGrid
						rows={rows}
						columns={columns}
						pageSize={10}
						rowsPerPageOptions={[10]}
					/>
				</Grid>
			</Grid>
		</AdminLayout>
	);
};

export default UsersPage;
