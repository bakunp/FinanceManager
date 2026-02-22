import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel', confirmColor = 'error' }) {
    return (
        <Dialog
            open={open}
            onClose={onCancel}
            PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
        >
            <DialogTitle sx={{ fontWeight: 700 }}>
                {title || 'Confirm Action'}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {message || 'Are you sure you want to proceed?'}
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onCancel} sx={{ textTransform: 'none' }}>
                    {cancelText}
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    color={confirmColor}
                    sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
