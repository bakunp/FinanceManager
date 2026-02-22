import { Box, Modal, TextField, Typography, MenuItem, FormControlLabel, Checkbox, Button, InputAdornment } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { addGoal, modifyGoal } from '../services/goalService';
import { modalBoxStyle } from './modalStyles';
import { useNotification } from './NotificationProvider';

export default function GoalModal({ open, onGoalAdded, goalToEdit, onClose }) {
    const { showSuccess, showError } = useNotification();

    const [name, setName] = useState('');
    const [priority, setPriority] = useState(1);
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(dayjs());
    const [skipDate, setSkipDate] = useState(true);
    const [errors, setErrors] = useState({});

    const resetForm = () => {
        setName('');
        setAmount('');
        setDate(dayjs());
        setPriority(1);
        setSkipDate(true);
        setErrors({});
    }

    useEffect(() => {
        if (open) {
            if (goalToEdit) {
                setName(goalToEdit.name);
                setAmount(goalToEdit.targetAmount);
                setPriority(goalToEdit.priority);

                if (goalToEdit.targetDate) {
                    setDate(dayjs(goalToEdit.targetDate));
                    setSkipDate(false);
                } else {
                    setDate(dayjs());
                    setSkipDate(true);
                }
            } else {
                resetForm();
            }
            setErrors({});
        }
    }, [goalToEdit, open]);

    const validate = () => {
        const newErrors = {};
        if (!name.trim()) newErrors.name = 'Goal name is required';
        const numAmount = parseFloat(amount);
        if (!amount || isNaN(numAmount) || numAmount <= 0) newErrors.amount = 'Amount must be greater than 0';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;

        const goalData = {
            name: name.trim(),
            targetAmount: parseFloat(amount),
            targetDate: skipDate ? null : (date ? date.toISOString() : null),
            priority: parseInt(priority)
        }

        let result;

        try {
            if (goalToEdit) {
                result = await modifyGoal({ id: goalToEdit.id, ...goalData });
            } else {
                result = await addGoal(goalData);
            }

            if (result) {
                showSuccess(goalToEdit ? 'Goal updated successfully' : 'Goal created successfully');
                if (onGoalAdded) onGoalAdded();
                onClose();
            } else {
                showError("Operation failed. Please try again.");
            }
        } catch (error) {
            console.error(error);
            showError("An error occurred while saving the goal.");
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
                        {goalToEdit ? "Edit Goal" : "Add New Goal"}
                    </Typography>
                    <TextField
                        fullWidth
                        required
                        label="Goal Name"
                        variant="outlined"
                        value={name}
                        onChange={(e) => { setName(e.target.value); if (errors.name) setErrors(prev => ({ ...prev, name: '' })); }}
                        error={!!errors.name}
                        helperText={errors.name}
                    />
                    <TextField
                        fullWidth
                        required
                        label="Target Amount"
                        type='number'
                        value={amount}
                        onChange={(e) => { setAmount(e.target.value); if (errors.amount) setErrors(prev => ({ ...prev, amount: '' })); }}
                        error={!!errors.amount}
                        helperText={errors.amount}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">PLN</InputAdornment>,
                        }}
                    />

                    <DatePicker
                        disabled={skipDate}
                        label="Target Date"
                        value={date}
                        onChange={(newValue) => setDate(newValue)}
                        slotProps={{ textField: { fullWidth: true } }}
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={skipDate}
                                onChange={(e) => setSkipDate(e.target.checked)}
                            />
                        }
                        label="Goal without date"
                    />

                    <TextField
                        select
                        fullWidth
                        label="Priority"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                    >
                        <MenuItem value={1}>Low</MenuItem>
                        <MenuItem value={2}>Medium</MenuItem>
                        <MenuItem value={3}>High</MenuItem>
                        <MenuItem value={5}>Important</MenuItem>
                        <MenuItem value={7}>Critical</MenuItem>
                    </TextField>

                    <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                        <Button
                            fullWidth
                            variant="outlined"
                            color="error"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            fullWidth
                            variant='contained'
                            size="large"
                            onClick={handleSave}
                        >
                            {goalToEdit ? "Save Changes" : "Create Goal"}
                        </Button>
                    </Box>
                </Box>
            </LocalizationProvider>
        </Modal>
    )
}