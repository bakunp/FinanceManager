import { Box, Button, Chip, IconButton, Paper, Typography, Grid, Avatar, Tooltip, useTheme, Skeleton } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from "react";
import { getFixedExpenses, removeFixedExpense } from "../services/fixedExpenseService";
import { Delete, Edit, TrendingDown, Receipt, CalendarToday, CheckCircle, Cancel } from "@mui/icons-material";
import FixedExpenseModal from "../components/FixedExpenseModal";
import ConfirmDialog from "../components/ConfirmDialog";
import { useNotification } from "../components/NotificationProvider";
import dayjs from 'dayjs';

function SummaryCardSkeleton() {
    return (
        <Paper elevation={0} sx={{ p: 3, borderRadius: 5, border: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2.5 }}>
            <Skeleton variant="circular" width={56} height={56} />
            <Box>
                <Skeleton variant="text" width={80} height={16} />
                <Skeleton variant="text" width={120} height={36} />
            </Box>
        </Paper>
    );
}

export default function Expenses() {
    const theme = useTheme();
    const { showSuccess, showError } = useNotification();
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expenseToEdit, setExpenseToEdit] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState({});
    const [confirmDialog, setConfirmDialog] = useState({ open: false, id: null });

    const processData = (data) => {
        const today = dayjs();
        return data.map(item => {
            const originalDay = dayjs(item.firstPaymentDate).date();
            let currentPaymentDate = today.date(originalDay).startOf('day');

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

    const handleDeleteRequest = (id) => {
        setConfirmDialog({ open: true, id });
    };

    const handleDeleteConfirm = async () => {
        const id = confirmDialog.id;
        setConfirmDialog({ open: false, id: null });
        const success = await removeFixedExpense(id);
        if (success) {
            showSuccess("Expense deleted successfully");
            fetchExpenses();
        } else {
            showError("Failed to delete expense");
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
                    <IconButton size="small" onClick={() => handleDeleteRequest(params.id)}>
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
                        textTransform: 'none', fontWeight: 600, background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)', color: '#1E1B4B', borderRadius: '12px',
                        padding: '10px 24px', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.35)'
                    }}
                >
                    New Expense
                </Button>
            </Box>

            <Grid container spacing={3} sx={{ mb: 5 }}>
                <Grid item xs={12} sm={6} md={4}>
                    {loading ? <SummaryCardSkeleton /> : (
                        <Paper elevation={0} sx={{ p: 3, borderRadius: 5, border: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2.5, boxShadow: theme.palette.mode === 'dark' ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                            <Avatar sx={{ bgcolor: 'success.light', color: 'success.dark', width: 56, height: 56 }}><TrendingDown /></Avatar>
                            <Box>
                                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Monthly Total</Typography>
                                <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary' }}>{totalSum} <span style={{ fontSize: '1rem', color: theme.palette.text.secondary }}>PLN</span></Typography>
                            </Box>
                        </Paper>
                    )}
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    {loading ? <SummaryCardSkeleton /> : (
                        <Paper elevation={0} sx={{ p: 3, borderRadius: 5, border: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2.5, boxShadow: theme.palette.mode === 'dark' ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                            <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.dark', width: 56, height: 56 }}><Receipt /></Avatar>
                            <Box>
                                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Active Items</Typography>
                                <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary' }}>{totalCount}</Typography>
                            </Box>
                        </Paper>
                    )}
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
                            bgcolor: 'background.surface',
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
                        '& .row-past-due': { bgcolor: 'background.surface', '&:hover': { bgcolor: 'action.hover' } },
                    }}
                />
            </Paper>

            <FixedExpenseModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onExpenseAdded={fetchExpenses}
                expenseToEdit={expenseToEdit}
            />

            <ConfirmDialog
                open={confirmDialog.open}
                title="Delete Expense"
                message="Are you sure you want to delete this expense? This action cannot be undone."
                confirmText="Delete"
                onConfirm={handleDeleteConfirm}
                onCancel={() => setConfirmDialog({ open: false, id: null })}
            />
        </Box>
    );
}