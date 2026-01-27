import { Box, Card, CardContent, Chip, IconButton, LinearProgress, Stack, Tooltip, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { PRIORITY_COLORS, PRIORITY_MAP } from "../constants/goalConstants";
import { removeGoal } from "../services/goalService";
import { EditDocument } from "@mui/icons-material";

export default function GoalCard({goal, onDelete, onEdit}){

    const isGoalAchieved = goal.currentAmount >= goal.targetAmount;
    const progressPercent = goal.targetAmount > 0 
        ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100) 
        : 0;
    const formattedDate = goal.targetDate 
        ? new Date(goal.targetDate).toLocaleDateString() 
        : 'No Date';

    const handleDeleteClick = async () => {
        if (window.confirm(`Are you sure to delete goal: "${goal.name}"?`)) {
            const success = await removeGoal(goal.id);
            if (success && onDelete) {
                onDelete();
            }
        }
    };
    
    let barColor = "primary";
    if (progressPercent > 50) barColor = "info";
    if (progressPercent >= 100) barColor = "success";

    return (
        <Card 
            sx={{ 
                minWidth: 275, 
                borderRadius: 4,
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                transition: '0.3s',
                position: 'relative',
                overflow: 'visible',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                }
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                            {goal.name}
                        </Typography>
                        <Chip
                            label={PRIORITY_MAP[goal.priority] || goal.priority}
                            color={PRIORITY_COLORS[goal.priority] || "default"}
                            size="small"
                            sx={{ mt: 1, fontWeight: 'bold', fontSize: '0.7rem', height: 24 }}
                        />
                    </Box>
                    <Stack direction="row" spacing={0}>
                        <Tooltip title="Edit the goal">
                            <IconButton onClick={() => onEdit(goal)} size="small" color="primary">
                                <EditDocument fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete the goal">
                            <IconButton onClick={handleDeleteClick} size="small" color="error">
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </Box>
                <Box sx={{ my: 3, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Amount
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: isGoalAchieved ? 'green' : '#333' }}>
                        {goal.currentAmount} <span style={{ fontSize: '1rem', color: '#666', fontWeight: 400 }}>PLN</span>
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Goal amount: {goal.targetAmount} PLN
                    </Typography>
                </Box>
                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="caption" fontWeight="bold" color="text.secondary">
                            Progress
                        </Typography>
                        <Typography variant="caption" fontWeight="bold" color={barColor + ".main"}>
                            {Math.round(progressPercent)}%
                        </Typography>
                    </Box>
                    
                    <LinearProgress 
                        variant="determinate" 
                        value={progressPercent} 
                        color={barColor}
                        sx={{ 
                            height: 10, 
                            borderRadius: 5,
                            backgroundColor: '#f0f0f0',
                            '& .MuiLinearProgress-bar': {
                                borderRadius: 5,
                            }
                        }} 
                    />
                </Box>

                <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'flex-end' }}>
                     <Typography variant="caption" color="text.secondary" fontStyle="italic">
                        Deadline: <strong>{formattedDate}</strong>
                     </Typography>
                </Box>

            </CardContent>
        </Card>
    );
}