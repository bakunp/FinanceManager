import { Box, Button, Chip, IconButton, Paper, Typography, Tooltip, Avatar } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from "react";
import { getFixedExpenses, removeFixedExpense } from "../services/fixedExpenseService";
import { Delete, Edit, AttachMoney, ReceiptLong } from "@mui/icons-material";
import FixedExpenseModal from "../components/FixedExpenseModal";

export default function Expenses() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expenseToEdit, setExpenseToEdit] = useState(null);

    const totalSum = rows.reduce((acc, curr) => acc + curr.amount, 0);
    const totalCount = rows.length;

    const handleAdd = () => {
        setExpenseToEdit(null);
        setIsModalOpen(true);
    };

    const handleEdit = (id) => {
        const expense = rows.find(r => r.id === id);
        if (expense) {
            setExpenseToEdit(expense);
            setIsModalOpen(true);
        }
    };

    const handleDelete = (id) => {
        if(window.confirm("Are you sure?")) {
            removeFixedExpense(id);
            fetchExpenses();
        }
    };

    const fetchExpenses = () => {
        setLoading(true);
        getFixedExpenses()
            .then(data => {
                setRows(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { 
            field: 'name', 
            headerName: 'Expense Name', 
            flex: 1, 
            minWidth: 180,
            headerClassName: 'super-app-theme--header' 
        },
        { 
            field: 'category', 
            headerName: 'Category', 
            width: 150,
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <Chip 
                    label={params.value || 'General'} 
                    size="small" 
                    variant="filled" 
                    sx={{ bgcolor: '#e3f2fd', color: '#1565c0', fontWeight: 'bold' }} 
                />
            )
        },
        { 
            field: 'firstPaymentDate', 
            headerName: 'Payment Date', 
            width: 150,
            headerClassName: 'super-app-theme--header',
            valueFormatter: (params) => {
                 if(!params) return "";
                 return new Date(params).toLocaleDateString();
            }
        },
        { 
            field: 'amount', 
            headerName: 'Amount', 
            width: 140,
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <Typography fontWeight="800" sx={{ color: '#2e7d32' }}>
                    {params.value} PLN
                </Typography>
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 120,
            sortable: false,
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Edit">
                        <IconButton 
                            size="small" 
                            onClick={() => handleEdit(params.id)}
                            sx={{ bgcolor: '#f5f5f5', '&:hover': { bgcolor: '#e3f2fd', color: '#1976d2' } }}
                        >
                            <Edit fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton 
                            size="small" 
                            color="error" 
                            onClick={() => handleDelete(params.id)}
                            sx={{ bgcolor: '#fff0f0', '&:hover': { bgcolor: '#ffebee' } }}
                        >
                            <Delete fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        },
    ];

    return(
        <Box sx={{ maxWidth: '100%', pb: 5 }}>
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4}}>
                <Box>
                    <Typography variant="h4" fontWeight="800" sx={{ color: '#1a237e', mb: 1}}>
                        Fixed Expenses
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage your recurring monthly payments efficiently.
                    </Typography>
                </Box>
                <Button 
                    variant="contained" 
                    startIcon={<AddIcon/>} 
                    size="large"
                    onClick={handleAdd}
                    sx={{ 
                        borderRadius: 3, 
                        px: 3, 
                        py: 1, 
                        textTransform: 'none', 
                        fontSize: '1rem',
                        boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)' 
                    }}
                >
                    Add Expense
                </Button>
            </Box>

            <FixedExpenseModal 
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onExpenseAdded={fetchExpenses}
                expenseToEdit={expenseToEdit}
            />

            <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
                <Paper 
                    elevation={0}
                    sx={{ 
                        p: 3, 
                        minWidth: 260, 
                        borderRadius: 4,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        background: 'linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)',
                        border: '1px solid #eef3f7',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
                    }}
                >
                    <Avatar sx={{ bgcolor: '#e3f2fd', color: '#1565c0', width: 56, height: 56 }}>
                        <AttachMoney fontSize="large" />
                    </Avatar>
                    <Box>
                        <Typography variant="body2" color="text.secondary" fontWeight="600">
                            Total Monthly Cost
                        </Typography>
                        <Typography variant="h4" fontWeight="800" color="#1a237e">
                            {totalSum} <span style={{fontSize: '1rem', color: '#888'}}>PLN</span>
                        </Typography>
                    </Box>
                </Paper>

                <Paper 
                    elevation={0}
                    sx={{ 
                        p: 3, 
                        minWidth: 260, 
                        borderRadius: 4,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        background: 'linear-gradient(135deg, #ffffff 0%, #fffbf0 100%)',
                        border: '1px solid #eef3f7',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
                    }}
                >
                    <Avatar sx={{ bgcolor: '#fff8e1', color: '#f57f17', width: 56, height: 56 }}>
                        <ReceiptLong fontSize="large" />
                    </Avatar>
                    <Box>
                        <Typography variant="body2" color="text.secondary" fontWeight="600">
                            Active Expenses
                        </Typography>
                        <Typography variant="h4" fontWeight="800" color="#1a237e">
                            {totalCount}
                        </Typography>
                    </Box>
                </Paper>
            </Box>

            <Box>
                <Paper 
                    elevation={0}
                    sx={{ 
                        height: 500, 
                        width: '100%', 
                        borderRadius: 4, 
                        border: '1px solid #e0e0e0',
                        overflow: 'hidden',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
                    }}
                >
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        initialState={{ pagination: { paginationModel: { page: 0, pageSize: 5 } } }}
                        pageSizeOptions={[5, 10, 20]}
                        checkboxSelection
                        disableRowSelectionOnClick
                        loading={loading}
                        rowHeight={60}
                        sx={{ 
                            border: 0,
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: '#f8f9fa',
                                color: '#495057',
                                fontWeight: 'bold',
                                borderBottom: '1px solid #e0e0e0',
                            },
                            '& .MuiDataGrid-row:hover': {
                                backgroundColor: '#f5f9ff',
                            }
                        }}
                    />
                </Paper>
            </Box>
        </Box>
    );
}