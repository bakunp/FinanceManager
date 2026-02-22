import { Box, Button, Modal, TextField, Typography, MenuItem } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { addFixedExpense, modifyFixedExpense } from '../services/fixedExpenseService';
import { useEffect, useState } from 'react';
import { modalBoxStyle } from './modalStyles';
import { useNotification } from './NotificationProvider';

export default function FixedExpenseModal({ open, onClose, onExpenseAdded, expenseToEdit }) {
    const { showSuccess, showError } = useNotification();

    const [name, setName] = useState('');
    const [unit, setUnit] = useState(3);
    const [frequency, setFrequency] = useState(1);
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(dayjs());
    const [errors, setErrors] = useState({});

    const resetForm = () => {
        setName('');
        setAmount('');
        setDate(dayjs());
        setUnit(3);
        setFrequency(1);
        setErrors({});
    }

    useEffect(() => {
        if (expenseToEdit) {
            setName(expenseToEdit.name);
            setAmount(expenseToEdit.amount);
            setUnit(expenseToEdit.unit || 3);
            setFrequency(expenseToEdit.frequency || 1);

            if (expenseToEdit.firstPaymentDate) {
                setDate(dayjs(expenseToEdit.firstPaymentDate));
            } else {
                setDate(dayjs());
            }
        } else {
            resetForm();
        }
        setErrors({});
    }, [expenseToEdit, open]);

    const validate = () => {
        const newErrors = {};
        if (!name.trim()) newErrors.name = 'Expense name is required';
        const numAmount = parseFloat(amount);
        if (!amount || isNaN(numAmount) || numAmount <= 0) newErrors.amount = 'Amount must be greater than 0';
        const numFreq = parseInt(frequency);
        if (!frequency || isNaN(numFreq) || numFreq <= 0) newErrors.frequency = 'Frequency must be at least 1';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;

        const expenseData = {
            name: name.trim(),
            amount: parseFloat(amount),
            firstPaymentDate: (date ? date.toISOString() : dayjs().toISOString()),
            frequency: parseInt(frequency),
            unit: parseInt(unit)
        }

        let result;

        try {
            if (expenseToEdit) {
                result = await modifyFixedExpense({ id: expenseToEdit.id, ...expenseData });
            } else {
                result = await addFixedExpense(expenseData);
            }

            if (result) {
                showSuccess(expenseToEdit ? 'Expense updated successfully' : 'Expense added successfully');
                if (onExpenseAdded) onExpenseAdded();
                onClose();
                resetForm();
            } else {
                showError("Operation failed. Please try again.");
            }
        } catch (error) {
            console.error(error);
            showError("An error occurred while saving the expense.");
        }
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
        >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={modalBoxStyle}>
                    <Typography variant='h5' component='h2' align="center" fontWeight="bold" mb={1}>
                        {expenseToEdit ? "Edit Expense" : "Add New Expense"}
                    </Typography>

                    <TextField
                        fullWidth
                        required
                        label="Expense Name"
                        value={name}
                        onChange={(e) => { setName(e.target.value); if (errors.name) setErrors(prev => ({ ...prev, name: '' })); }}
                        error={!!errors.name}
                        helperText={errors.name}
                    />

                    <TextField
                        fullWidth
                        required
                        label="Amount"
                        type='number'
                        value={amount}
                        onChange={(e) => { setAmount(e.target.value); if (errors.amount) setErrors(prev => ({ ...prev, amount: '' })); }}
                        error={!!errors.amount}
                        helperText={errors.amount}
                    />

                    <DatePicker
                        label="First payment date"
                        value={date}
                        onChange={(newValue) => setDate(newValue)}
                        slotProps={{ textField: { fullWidth: true } }}
                    />

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                            fullWidth
                            label="Frequency"
                            type='number'
                            value={frequency}
                            onChange={(e) => { setFrequency(e.target.value); if (errors.frequency) setErrors(prev => ({ ...prev, frequency: '' })); }}
                            error={!!errors.frequency}
                            helperText={errors.frequency}
                        />
                        <TextField
                            select
                            fullWidth
                            label="Unit"
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                        >
                            <MenuItem value={1}>Day</MenuItem>
                            <MenuItem value={2}>Week</MenuItem>
                            <MenuItem value={3}>Month</MenuItem>
                            <MenuItem value={4}>Year</MenuItem>
                        </TextField>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                        <Button fullWidth variant="outlined" color="error" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            fullWidth
                            variant='contained'
                            size="large"
                            onClick={handleSave}
                        >
                            {expenseToEdit ? "Save Changes" : "Add"}
                        </Button>
                    </Box>
                </Box>
            </LocalizationProvider>
        </Modal>
    )
}