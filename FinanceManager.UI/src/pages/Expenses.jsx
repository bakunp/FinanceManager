import { Box, Button, Chip, IconButton, Paper, Typography, Grid, Avatar, Tooltip } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from "react";
import { getFixedExpenses, removeFixedExpense } from "../services/fixedExpenseService";
import { Delete, Edit, TrendingDown, Receipt, CalendarToday, CheckCircle, Cancel } from "@mui/icons-material";
import FixedExpenseModal from "../components/FixedExpenseModal";
import dayjs from 'dayjs';

export default function Expenses() {
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
            let currentPaymentDate = today.date(originalDay);
            
            if (today.date() > originalDay && today.add(1, 'month').month() !== today.month()) {
                 
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

    const handleDelete = (id) => {
        if(window.confirm("Are you sure?")) {
            removeFixedExpense(id);
            fetchExpenses();
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
                <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                    <Typography variant="body2" fontWeight="600" sx={{ color: '#111827' }}>
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
                            bgcolor: '#F3F4F6', 
                            color: '#374151', 
                            fontWeight: '600',
                            borderRadius: '6px',
                            height: '24px',
                            fontSize: '0.75rem',
                            border: '1px solid #E5E7EB'
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

                let dateColor = '#6B7280';
                if (isPast && !status) dateColor = '#EF4444';

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
                    <Typography variant="body2" fontWeight="700" sx={{ color: '#111827' }}>
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
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#111827', letterSpacing: '-0.03em', mb: 1 }}>
                        Fixed Expenses
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#6B7280' }}>
                        {dayjs().format('MMMM YYYY')} Overview
                    </Typography>
                </Box>
                <Button 
                    variant="contained" 
                    startIcon={<AddIcon />} 
                    onClick={handleAdd}
                    sx={{ 
                        textTransform: 'none', fontWeight: 600, bgcolor: '#2563EB', borderRadius: '10px',
                        padding: '10px 24px', '&:hover': { bgcolor: '#1D4ED8' }
                    }}
                >
                    New Expense
                </Button>
            </Box>

            <Grid container spacing={3} sx={{ mb: 5 }}>
                <Grid item xs={12} sm={6} md={4}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: 2.5 }}>
                        <Avatar sx={{ bgcolor: '#ECFDF5', color: '#059669' }}><TrendingDown /></Avatar>
                        <Box>
                            <Typography variant="caption" sx={{ color: '#6B7280', fontWeight: 700, textTransform: 'uppercase' }}>Monthly Total</Typography>
                            <Typography variant="h4" sx={{ fontWeight: 800, color: '#111827' }}>{totalSum} <span style={{ fontSize: '1rem', color: '#9CA3AF' }}>PLN</span></Typography>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: 2.5 }}>
                        <Avatar sx={{ bgcolor: '#EFF6FF', color: '#3B82F6' }}><Receipt /></Avatar>
                        <Box>
                            <Typography variant="caption" sx={{ color: '#6B7280', fontWeight: 700, textTransform: 'uppercase' }}>Active Items</Typography>
                            <Typography variant="h4" sx={{ fontWeight: 800, color: '#111827' }}>{totalCount}</Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid #E5E7EB', overflow: 'hidden', bgcolor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
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
                        '& .MuiDataGrid-columnHeaders': { bgcolor: '#F9FAFB', borderBottom: '1px solid #E5E7EB', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem' },
                        '& .MuiDataGrid-cell': { borderBottom: '1px solid #F3F4F6' },
                        '& .row-paid': { bgcolor: '#ECFDF5', '&:hover': { bgcolor: '#D1FAE5' }, color: '#065F46' },
                        '& .row-unpaid': { bgcolor: '#FEF2F2', '&:hover': { bgcolor: '#FEE2E2' }, color: '#991B1B' },
                        '& .row-past-due': { bgcolor: '#F9FAFB', '&:hover': { bgcolor: '#F3F4F6' } }, 
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