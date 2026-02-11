import React, { useEffect, useState } from 'react';
import { 
    Box, Modal, Typography, IconButton, CircularProgress, 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';
import { getTransactionHistory } from '../services/goalService';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    borderRadius: 3,
    boxShadow: 24,
    p: 4,
    outline: 'none',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column'
};

export default function GoalDetailedInfoModal({ openedGoal, onClose }) {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (openedGoal?.id) {
            setLoading(true);
            getTransactionHistory(openedGoal.id)
                .then(data => {
                    setHistory(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [openedGoal?.id]);

    if (!openedGoal) return null;

    return (
        <Modal
            open={!!openedGoal}
            onClose={onClose}
        >
            <Box sx={style}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box>
                        <Typography variant='h3' fontWeight="bold">
                            {openedGoal.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Goal: {openedGoal.targetAmount} PLN
                        </Typography>
                    </Box>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Box sx={(theme) => ({ 
                    mb: 3, 
                    p: 2, 
                    bgcolor: theme.palette.mode === 'dark' ? 'action.hover' : '#f5f5f5', 
                    borderRadius: 2, 
                    display: 'flex', 
                    justifyContent: 'space-around' 
                })}>
                    <Box textAlign="center">
                        <Typography variant="caption" color="text.secondary">Current amount</Typography>
                        <Typography variant="h6" color="success.main" fontWeight="bold">
                            {openedGoal.currentAmount} PLN
                        </Typography>
                    </Box>
                    <Box textAlign="center">
                         <Typography variant="caption" color="text.secondary">Total left</Typography>
                         <Typography variant="h6" fontWeight="bold">
                            {Math.max(0, openedGoal.targetAmount - openedGoal.currentAmount)} PLN
                         </Typography>
                    </Box>
                </Box>

                <Typography variant="h6" sx={{ mb: 1 }}>Transactions history</Typography>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <TableContainer component={Paper} sx={{ flexGrow: 1, overflow: 'auto', boxShadow: 'none', border: '1px solid #e0e0e0' }}>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell align="right">Amount</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {history.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                                            No transactions history.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    history.map((row) => (
                                        <TableRow key={row.id}>
                                            <TableCell>
                                                {dayjs(row.date).format('DD.MM.YYYY HH:mm')}
                                            </TableCell>
                                            <TableCell>{row.description || "Transaction"}</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold', color: 'green' }}>
                                                +{row.amount} PLN
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>
        </Modal>
    );
}