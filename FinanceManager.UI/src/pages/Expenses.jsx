import { Box, Button, Chip, IconButton, Paper, Typography, Grid, Avatar, Tooltip, useTheme } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from "react";
import { getFixedExpenses, removeFixedExpense } from "../services/fixedExpenseService";
import { Delete, Edit, TrendingDown, Receipt, CalendarToday, CheckCircle, Cancel } from "@mui/icons-material";
import FixedExpenseModal from "../components/FixedExpenseModal";
import dayjs from 'dayjs';

export default function Expenses() {
    const theme = useTheme();
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expenseToEdit, setExpenseToEdit] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState({});

    const processData = (data) => {
        const today = dayjs();
        return data.map(item => {
            const originalDay = dayjs(item.firstPaymentDate).date();
            let currentPaymentDate = today.date(originalDay).startOf('day');

            // If the day doesn't exist in current month (e.g. 31st in Feb), 
            // dayjs automatically rolls it to the last day of the month.
            if (originalDay > today.daysInMonth()) {
                currentPaymentDate = today.endOf('month').startOf('day');
            }
            return {
                ...item,
                displayDate: currentPaymentDate.toISOString(),
                isPast: currentPaymentDate.isBefore(today, 'day'),
                isToday: currentPaymentDate.isSame(today, 'day')
            };
        });
    };

    const fetchExpenses = () => {
        setLoading(true);
        getFixedExpenses()
            .then(data => {
                const processed = processData(data);
                setRows(processed);
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

    const handleMarkStatus = (id, status) => {
        setPaymentStatus(prev => ({
            ...prev,
            [id]: status
        }));
    };

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

    const handleDelete = async (id) => {
        if(window.confirm("Are you sure?")) {
            const success = await removeFixedExpense(id);
            if (success) fetchExpenses();
            else alert("Failed to delete expense");
        }
    };

    const totalSum = rows.reduce((acc, curr) => acc + curr.amount, 0);
    const totalCount = rows.length;

    const columns = [
        { 
            field: 'name', 
            headerName: 'Expense Name', 
            flex: 1, 
            minWidth: 200,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', color: 'text.primary' }}>
                    <Typography variant="body2" fontWeight="600">
                        {params.value}
                    </Typography>
                </Box>
            )
        },
        { 
            field: 'category', 
            headerName: 'Category', 
            width: 140,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                    <Chip 
                        label={params.value || 'General'} 
                        size="small" 
                        sx={{ 
                            bgcolor: 'action.hover', 
                            color: 'text.secondary', 
                            fontWeight: '600',
                            borderRadius: '6px',
                            height: '24px',
                            fontSize: '0.75rem',
                            border: '1px solid',
                            borderColor: 'divider'
                        }} 
                    />
                </Box>
            )
        },
        { 
            field: 'displayDate', 
            headerName: 'Due Date', 
            width: 160,
            renderCell: (params) => {
                const date = dayjs(params.value);
                const isPast = params.row.isPast;
                const status = paymentStatus[params.row.id];

                let dateColor = 'text.secondary';
                if (isPast && !status) dateColor = 'error.main';

                return (
                    <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', color: dateColor, gap: 1 }}>
                        <CalendarToday sx={{ fontSize: 16, opacity: 0.8 }} />
                        <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: isPast ? 700 : 400 }}>
                            {date.format('DD.MM.YYYY')}
                        </Typography>
                    </Box>
                )
            }
        },
        { 
            field: 'amount', 
            headerName: 'Amount', 
            width: 140,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                    <Typography variant="body2" fontWeight="700" sx={{ color: 'text.primary' }}>
                        {params.value} PLN
                    </Typography>
                </Box>
            )
        },
        {
            field: 'status',
            headerName: 'Payment Status',
            width: 160,
            renderCell: (params) => {
                const isPast = params.row.isPast;
                const status = paymentStatus[params.row.id];

                if (status === 'PAID') {
                    return <Chip icon={<CheckCircle />} label="Paid" color="success" size="small" variant="outlined" />;
                }
                if (status === 'UNPAID') {
                    return <Chip icon={<Cancel />} label="Not Paid" color="error" size="small" variant="outlined" />;
                }

                if (isPast || params.row.isToday) {
                    return (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Mark as Paid">
                                <IconButton size="small" color="success" onClick={() => handleMarkStatus(params.row.id, 'PAID')}>
                                    <CheckCircle />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Mark as Not Paid">
                                <IconButton size="small" color="error" onClick={() => handleMarkStatus(params.row.id, 'UNPAID')}>
                                    <Cancel />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    );
                }

                return <Typography variant="caption" color="text.secondary">Upcoming</Typography>;
            }
        },
        {
            field: 'actions',
            headerName: '',
            width: 100,
            sortable: false,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', gap: 1, opacity: 0.5, '&:hover': { opacity: 1 } }}>
                    <IconButton size="small" onClick={() => handleEdit(params.id)}>
                        <Edit sx={{ fontSize: 18 }} />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(params.id)}>
                        <Delete sx={{ fontSize: 18 }} />
                    </IconButton>
                </Box>
            ),
        },
    ];

    return (
        <Box sx={{ maxWidth: '1600px', margin: '0 auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: '-0.03em', mb: 1 }}>
                        Fixed Expenses
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        {dayjs().format('MMMM YYYY')} Overview
                    </Typography>
                </Box>
                <Button 
                    variant="contained" 
                    startIcon={<AddIcon />} 
                    onClick={handleAdd}
                    sx={{
                        textTransform: 'none', fontWeight: 600, background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)', borderRadius: '12px',
                        padding: '10px 24px', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
                    }}
                >
                    New Expense
                </Button>
            </Box>

            <Grid container spacing={3} sx={{ mb: 5 }}>
                <Grid item xs={12} sm={6} md={4}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 5, border: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2.5, boxShadow: theme.palette.mode === 'dark' ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                        <Avatar sx={{ bgcolor: 'success.light', color: 'success.dark', width: 56, height: 56 }}><TrendingDown /></Avatar>
                        <Box>
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Monthly Total</Typography>
                            <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary' }}>{totalSum} <span style={{ fontSize: '1rem', color: 'text.secondary' }}>PLN</span></Typography>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 5, border: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2.5, boxShadow: theme.palette.mode === 'dark' ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                        <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.dark', width: 56, height: 56 }}><Receipt /></Avatar>
                        <Box>
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Active Items</Typography>
                            <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary' }}>{totalCount}</Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            <Paper elevation={0} sx={{ borderRadius: 5, border: '1px solid', borderColor: 'divider', overflow: 'hidden', boxShadow: theme.palette.mode === 'dark' ? 'none' : '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    autoHeight
                    rowHeight={72}
                    disableRowSelectionOnClick
                    loading={loading}
                    getRowClassName={(params) => {
                        const status = paymentStatus[params.id];
                        const isPast = params.row.isPast;

                        if (status === 'PAID') return 'row-paid';
                        if (status === 'UNPAID') return 'row-unpaid';
                        if (isPast) return 'row-past-due'; 
                        return '';
                    }}
                    sx={{ 
                        border: 0,
                        '& .MuiDataGrid-columnHeaders': { 
                            bgcolor: theme.palette.mode === 'dark' ? '#0F172A' : '#F9FAFB', 
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            color: 'text.secondary', 
                            fontWeight: 700, 
                            textTransform: 'uppercase', 
                            fontSize: '0.75rem' 
                        },
                        '& .MuiDataGrid-cell': { 
                            borderBottom: '1px solid',
                            borderColor: 'divider'
                        },
                        '& .row-paid': { bgcolor: theme.palette.mode === 'dark' ? 'rgba(22, 163, 74, 0.2)' : '#ECFDF5', '&:hover': { bgcolor: theme.palette.mode === 'dark' ? 'rgba(22, 163, 74, 0.3)' : '#D1FAE5' } },
                        '& .row-unpaid': { bgcolor: theme.palette.mode === 'dark' ? 'rgba(220, 38, 38, 0.2)' : '#FEF2F2', '&:hover': { bgcolor: theme.palette.mode === 'dark' ? 'rgba(220, 38, 38, 0.3)' : '#FEE2E2' } },
                        '& .row-past-due': { bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : '#F9FAFB', '&:hover': { bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#F3F4F6' } }, 
                    }}
                />
            </Paper>

            <FixedExpenseModal 
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onExpenseAdded={fetchExpenses}
                expenseToEdit={expenseToEdit}
            />
        </Box>
    );
}