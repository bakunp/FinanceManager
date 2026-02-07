import { Box, Button, Paper, Table, Typography } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import React from "react";

export default function Expenses () {
    const [rows, setRows] = React.useState(/** rows to be pulled from backend */);
    const [sum, setSum] = React.useState(15);
    const [amount, setAmount] = React.useState(15);

    const paginationModel = { page: 0, pageSize: 5 };
    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Name', flex: 1, minWidth: 150 },
        { 
            field: 'category', 
            headerName: 'Category', 
            width: 150,
            renderCell: (params) => (
                <Chip label={params.value} size="small" variant="outlined" />
            )
        },
        { field: 'date', headerName: 'Payment Date', width: 130 },
        { 
            field: 'amount', 
            headerName: 'Amount', 
            width: 130,
            renderCell: (params) => (
                <Typography fontWeight="bold" color="primary">
                    {params.value} PLN
                </Typography>
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            sortable: false,
            renderCell: (params) => (
                <Box>
                    <IconButton size="small" color="primary" onClick={() => console.log('Edit', params.id)}>
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => console.log('Delete', params.id)}>
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Box>
            ),
        },
    ];

    return(
        <Box>
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4}}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: '#333'}}>
                        Fixed Expenses
                    </Typography>
                </Box>
            </Box>

            <Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon/>}
                    size="large"
                    sx={{borderRadius: 2}}>
                        Add Fixed Expense
                </Button>
            </Box>

            <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
                <Paper sx={{ p: 2, minWidth: 200, borderRadius: 3}}>
                    <Typography variant="caption" color="text.secondary">Total monthly sum: </Typography>
                    <Typography variant="h5" fontWeight="Bold" color="primary">{sum}</Typography>
                </Paper>
                <Paper sx={{ p: 2, minWidth: 200, borderRadius: 3}}>
                    <Typography variant="caption" color="text.secondary">Amount of expenses: </Typography>
                    <Typography variant="h5" fontWeight="Bold" color="primary">{amount}</Typography>
                </Paper>
            </Box>

            <Box>
                <Paper sx={ {height: 400, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        initialState={{ pagination: { paginationModel } }}
                        pageSizeOptions={[5, 10]}
                        checkboxSelection
                        sx={{ border: 0 }}
                    />
                </Paper>
            </Box>
        </Box>
    );
}