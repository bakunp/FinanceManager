import React, { useState, useEffect } from 'react';
import { 
    Box, Button, Modal, TextField, Typography, Switch, Stack, 
    List, ListItem, ListItemButton, ListItemText, ListItemIcon, 
    Radio, Paper, InputAdornment, 
    FormControlLabel,
    Checkbox
} from '@mui/material';
import SavingsIcon from '@mui/icons-material/Savings';
import { addFundsAutomatically, addFundsManually } from '../services/fundService';

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
};

export default function PaymentModal({ open, onClose, onPaymentCreated, allGoals }) {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [isAutomatic, setIsAutomatic] = useState(false);
    const [selectedGoalId, setSelectedGoalId] = useState(null);
    const [skipDescription, setSkipDescription] = useState(true);

    const resetForm = () => {
        setAmount('');
        setDescription('Automatic fund allocation');
        setIsAutomatic(false);
        setSelectedGoalId(null);
        setSkipDescription(true);
    };

    useEffect(() => {
        if (!open) {
            resetForm();
        }
    }, [open]);

    const handleSwitchChange = (event) => {
        setIsAutomatic(event.target.checked);
    };

    const handleSave = async () => {
        const paymentData = {
            amount: parseFloat(amount),
            description: description,
            type: isAutomatic ? 'Automatic' : 'Manual',
            goalId: selectedGoalId
        };

        let result;

        if(isAutomatic) {
            result = await addFundsAutomatically(paymentData.amount, paymentData.description);
        } else {
            result = await addFundsManually(paymentData.goalId, paymentData.amount, paymentData.description); 
        }

        if (onPaymentCreated) onPaymentCreated();
        onClose();
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
        >
            <Box sx={style}>
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
                    onChange={(e) => setAmount(e.target.value)}
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
                            onChange={(e) => setSkipDescription(e.target.checked)} 
                        />
                    } 
                    label="Default description"
                />

                {!isAutomatic && (
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                            Select Goal:
                        </Typography>
                        
                        <Paper variant="outlined" sx={{ maxHeight: 200, overflow: 'auto' }}>
                            {allGoals && allGoals.length > 0 ? (
                                <List dense>
                                    {allGoals.map((goal) => {
                                        const isSelected = selectedGoalId === goal.id;
                                        return (
                                            <ListItem key={goal.id} disablePadding divider>
                                                <ListItemButton 
                                                    onClick={() => setSelectedGoalId(goal.id)}
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
                        disabled={!amount || (!isAutomatic && !selectedGoalId)}
                    >
                        Save Payment
                    </Button>
                </Box>
            </Box>
        </Modal>
    )
}