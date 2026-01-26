import { Box, Card, CardContent, Chip, IconButton, LinearProgress, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { PRIORITY_COLORS, PRIORITY_MAP } from "../constants/goalConstants";
import { removeGoal } from "../services/goalService";

export default function GoalTile({goal, onDelete}){

    const isGoalAchieved = goal.currentAmount >= goal.targetAmount;
    const statusColor = isGoalAchieved ? "success" : "primary";
    const progressPercent = goal.targetAmount > 0 
        ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100) 
        : 0;
    const formattedDate = goal.targetDate 
        ? new Date(goal.targetDate).toLocaleDateString() 
        : 'No Date';

    const handleDeleteClick = async () => {
        if (window.confirm(`Czy na pewno chcesz usunąć cel: "${goal.name}"?`)) {
            const success = await removeGoal(goal.id);
            if (success && onDelete) {
                onDelete();
            }
        }
    };

return (
        <Card sx={{ minWidth: 275, boxShadow: 3, borderRadius: 2 }}>
            <CardContent>    
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                            {goal.name}
                        </Typography>
                        <Chip
                            label={PRIORITY_MAP[goal.priority] || goal.priority}
                            color={PRIORITY_COLORS[goal.priority] || "default"}
                            variant="outlined"
                            size="small"
                        />
                    </Box>
                    <IconButton 
                        aria-label="delete" 
                        onClick={handleDeleteClick}
                        size="small"
                        sx={{ mt: -1, mr: -1 }}
                    >
                        <CloseIcon/>
                    </IconButton>
                </Box>
         
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        Deadline:
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                        {formattedDate}
                    </Typography>
                </Box>

                <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                            Progress ({Math.round(progressPercent)}%)
                        </Typography>
                        <Typography variant="caption" fontWeight="bold" color={isGoalAchieved ? "green" : "inherit"}>
                            {goal.currentAmount} / {goal.targetAmount} PLN
                        </Typography>
                    </Box>
                    
                    <LinearProgress
                        variant="determinate" 
                        value={progressPercent} 
                        color={statusColor}
                        sx={{ height: 10, borderRadius: 5 }}
                    />
                </Box>

            </CardContent>
        </Card>
    )
}