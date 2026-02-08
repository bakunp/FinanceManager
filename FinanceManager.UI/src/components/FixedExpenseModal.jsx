import { Box, Button, Modal, TextField, Typography, MenuItem } from '@mui/material'; 
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { addFixedExpense, modifyFixedExpense } from '../services/fixedExpenseService';
import { useEffect, useState } from 'react';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: 3,
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    gap: 2.5,
    outline: 'none'
}

export default function FixedExpenseModal({ open, onClose, onExpenseAdded, expenseToEdit }) {
    
    const [name, setName] = useState('');
    const [unit, setUnit] = useState(3);
    const [frequency, setFrequency] = useState(1);
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(dayjs());

    const resetForm = () => {
        setName('');
        setAmount('');
        setDate(dayjs());
        setUnit(3);
        setFrequency(1);
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
    }, [expenseToEdit, open]);

    const handleSave = async () => {
        const expenseData = {
            name: name,
            amount: parseFloat(amount),
            firstPaymentDate: (date ? date.toISOString() : dayjs().toISOString()),
            frequency: parseInt(frequency),
            unit: parseInt(unit)
        }

        let result;

        if (expenseToEdit) {
            result = await modifyFixedExpense({ id: expenseToEdit.id, ...expenseData });
        } else {
            result = await addFixedExpense(expenseData);
        }
        
        if(result) {
            if(onExpenseAdded) onExpenseAdded();
            onClose();
            resetForm();
        } else {
            alert("Operation failed");
        }
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
        >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={style}>
                    <Typography variant='h5' component='h2' align="center" fontWeight="bold" mb={1}>
                        {expenseToEdit ? "Edit Expense" : "Add New Expense"}
                    </Typography>
                    
                    <TextField
                        fullWidth
                        required
                        label="Expense Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    
                    <TextField
                        fullWidth
                        required
                        label="Amount"
                        type='number'
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
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
                            onChange={(e) => setFrequency(e.target.value)}
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
                            disabled={!name || !amount}
                        >
                            {expenseToEdit ? "Save Changes" : "Add"}
                        </Button>
                    </Box>
                </Box>
            </LocalizationProvider>
        </Modal>
    )
}