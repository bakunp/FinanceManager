import { useState, useEffect } from 'react';
import {
    Box, Button, Modal, TextField, Typography, Switch, Stack,
    List, ListItem, ListItemButton, ListItemText, ListItemIcon,
    Radio, Paper, InputAdornment, FormControlLabel, Checkbox
} from '@mui/material';
import SavingsIcon from '@mui/icons-material/Savings';
import { addFundsAutomatically, addFundsManually } from '../services/fundService';
import { modalBoxStyle } from './modalStyles';
import { useNotification } from './NotificationProvider';

export default function PaymentModal({ open, onClose, onPaymentCreated, allGoals }) {
    const { showSuccess, showError } = useNotification();
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [isAutomatic, setIsAutomatic] = useState(false);
    const [selectedGoalId, setSelectedGoalId] = useState(null);
    const [skipDescription, setSkipDescription] = useState(true);
    const [errors, setErrors] = useState({});

    const resetForm = () => {
        setAmount('');
        setDescription('Automatic fund allocation');
        setIsAutomatic(false);
        setSelectedGoalId(null);
        setSkipDescription(true);
        setErrors({});
    };

    useEffect(() => {
        if (!open) {
            resetForm();
        }
    }, [open]);

    const handleSwitchChange = (event) => {
        setIsAutomatic(event.target.checked);
        setErrors({});
    };

    const validate = () => {
        const newErrors = {};
        const numAmount = parseFloat(amount);
        if (!amount || isNaN(numAmount) || numAmount <= 0) newErrors.amount = 'Amount must be greater than 0';
        if (!isAutomatic && !selectedGoalId) newErrors.goal = 'Please select a goal';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;

        let result;

        try {
            if (isAutomatic) {
                result = await addFundsAutomatically(parseFloat(amount), description);
            } else {
                result = await addFundsManually(selectedGoalId, parseFloat(amount), description);
            }

            if (result) {
                showSuccess('Payment saved successfully');
                if (onPaymentCreated) onPaymentCreated();
                onClose();
            } else {
                showError('Failed to save payment. Please try again.');
            }
        } catch (error) {
            console.error(error);
            showError('An error occurred while saving the payment.');
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
        >
            <Box sx={modalBoxStyle}>
                <Typography variant='h5' align="center" fontWeight="bold">
                    Add New Payment
                </Typography>

                <Stack
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: 'center', justifyContent: 'center' }}
                >
                    <Typography color={!isAutomatic ? "primary" : "text.secondary"}>Manual</Typography>
                    <Switch
                        checked={isAutomatic}
                        onChange={handleSwitchChange}
                    />
                    <Typography color={isAutomatic ? "primary" : "text.secondary"}>Automatic</Typography>
                </Stack>

                <TextField
                    fullWidth
                    required
                    label="Amount"
                    type='number'
                    value={amount}
                    onChange={(e) => { setAmount(e.target.value); if (errors.amount) setErrors(prev => ({ ...prev, amount: '' })); }}
                    error={!!errors.amount}
                    helperText={errors.amount}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">PLN</InputAdornment>,
                    }}
                />
                <TextField
                    disabled={skipDescription}
                    required
                    fullWidth
                    label="Description"
                    variant="outlined"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={skipDescription}
                            onChange={(e) => {
                                setSkipDescription(e.target.checked);
                                if (e.target.checked) {
                                    setDescription('Automatic fund allocation');
                                }
                            }}
                        />
                    }
                    label="Default description"
                />

                {!isAutomatic && (
                    <Box>
                        <Typography variant="subtitle2" color={errors.goal ? "error" : "text.secondary"} sx={{ mb: 1 }}>
                            Select Goal: {errors.goal && <span style={{ fontWeight: 400 }}>({errors.goal})</span>}
                        </Typography>

                        <Paper variant="outlined" sx={{ maxHeight: 200, overflow: 'auto', borderColor: errors.goal ? 'error.main' : 'divider' }}>
                            {allGoals && allGoals.length > 0 ? (
                                <List dense>
                                    {allGoals.map((goal) => {
                                        const isSelected = selectedGoalId === goal.id;
                                        return (
                                            <ListItem key={goal.id} disablePadding divider>
                                                <ListItemButton
                                                    onClick={() => { setSelectedGoalId(goal.id); if (errors.goal) setErrors(prev => ({ ...prev, goal: '' })); }}
                                                    selected={isSelected}
                                                >
                                                    <ListItemIcon>
                                                        <Radio
                                                            checked={isSelected}
                                                            edge="start"
                                                            tabIndex={-1}
                                                            disableRipple
                                                        />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={goal.name}
                                                        secondary={`Target: ${goal.targetAmount} PLN`}
                                                    />
                                                    {isSelected && <SavingsIcon color="primary" fontSize="small" />}
                                                </ListItemButton>
                                            </ListItem>
                                        );
                                    })}
                                </List>
                            ) : (
                                <Typography sx={{ p: 2, textAlign: 'center', fontStyle: 'italic', color: 'text.secondary' }}>
                                    No goals available. Add a goal first.
                                </Typography>
                            )}
                        </Paper>
                    </Box>
                )}

                {isAutomatic && (
                    <Typography variant="body2" color="text.secondary" align="center">
                        Automatic payments will be deducted based on your schedule settings.
                    </Typography>
                )}

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
                        Save Payment
                    </Button>
                </Box>
            </Box>
        </Modal>
    )
}