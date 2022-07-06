import React from 'react'
import { Box, Typography } from '@mui/material'
import { ShopLayout } from '../components/layouts'

const Custom404 = () => {
  return (
    <ShopLayout title='Teslo | Página no encontrada' pageDescription='No hay nada que mostrar aquí' >
      <Box sx={{ flexDirection: { xs: 'column', sm: 'row' } }} display='flex' justifyContent='center' alignItems='center' height='calc(100vh - 200px)'>
        <Typography variant='h1' component='h1' fontSize={70} fontWeight={200}>404 |</Typography>
        <Typography marginLeft={2}>No encontramos ninguna página aquí</Typography>
      </Box>

    </ShopLayout>
  )
}

export default Custom404