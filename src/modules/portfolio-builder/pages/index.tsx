/** React Imports */
import { useMemo } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import {
  Typography,
  CardHeader,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  IconButton,
  Box,
  Tooltip
} from '@mui/material'
import { Add, Edit, Visibility } from '@mui/icons-material'
import { Button, Stack, Breadcrumbs } from '@mui/material'
import { NavigateNext } from '@mui/icons-material'

/** Next Imports */
import { useRouter } from 'next/router'

/** Type Imports */
import { IListTable } from '../types'

const breadcrumbs = [
  <Typography key='4' fontWeight='600'>
    List Portfolio
  </Typography>
]

const IndexPage = () => {
  const router = useRouter()

  const dataTable: Array<IListTable> = useMemo(
    () => JSON.parse(window.localStorage.getItem('dataTablePortfolio') || '[]'),
    []
  )

  return (
    <Stack spacing={5}>
      <Breadcrumbs separator={<NavigateNext fontSize='small' />} aria-label='breadcrumb'>
        {breadcrumbs}
      </Breadcrumbs>

      <Card>
        <CardHeader
          title='List Portfolio'
          action={
            <Button variant='contained' startIcon={<Add />} onClick={() => router.push('/home/editor/add')}>
              Add New Data
            </Button>
          }
        ></CardHeader>
        <CardContent>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label='simple table'>
              <TableHead>
                <TableRow>
                  <TableCell>No</TableCell>
                  <TableCell>Avatar</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Total Portfolio</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataTable.map((row, idx) => (
                  <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component='th' scope='row'>
                      {idx + 1}
                    </TableCell>
                    <TableCell>
                      <Avatar src={row.photoProfile} alt='no-image' />
                    </TableCell>
                    <TableCell component='th' scope='row'>
                      {row.namePerson}
                    </TableCell>
                    <TableCell>{row.title}</TableCell>
                    <TableCell>{row.portfolios.length}</TableCell>
                    <TableCell>
                      <Box>
                        <Tooltip title='Edit'>
                          <IconButton onClick={() => router.push(`/home/editor/${row.id}`)}>
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title='Preview'>
                          <IconButton onClick={() => router.push(`/home/preview/${row.id}`)}>
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {dataTable.length === 0 && (
            <Typography textAlign={'center'} fontStyle={'italic'}>
              no data available here
            </Typography>
          )}
        </CardContent>
      </Card>
    </Stack>
  )
}

export default IndexPage
