import { Box, Button, Paper, Table, Typography } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import React from "react";

export default function Expenses () {
    const [sum, setSum] = React.useState(15);
    const [amount, setAmount] = React.useState(15);

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