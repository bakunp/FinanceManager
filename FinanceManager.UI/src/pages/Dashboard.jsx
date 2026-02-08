import { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, Paper, Container, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import GoalCard from '../components/GoalCard';
import GoalModal from '../components/GoalModal';
import PaymentModal from '../components/PaymentModal';
import GoalDetailedInfoModal from '../components/GoalDetailedInfoModal';
import { getAllGoals } from '../services/goalService';

export default function Dashboard() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingGoal, setEditingGoal] = useState(null);
  const [openedGoal, setOpenedGoal] = useState(null);
  
  // Stan otwarcia modali (sterowany przyciskami w Headerze)
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handleEdit = (goal) => {
      setEditingGoal(goal);
      setIsGoalModalOpen(true);
  }

  const handleOpen = (goal) => {
    setOpenedGoal(goal);
  }

  const fetchGoals = () => {
    setLoading(true);
    getAllGoals()
      .then(data => {
        setGoals(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchGoals();
  }, []);
  
  return(
    <Box>
        {/* --- HEADER SEKCJI --- */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
            <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#111827', mb: 1 }}>
                    My Goals
                </Typography>
                <Typography variant="body1" sx={{ color: '#6B7280' }}>
                    Manage and track your savings progress.
                </Typography>
            </Box>
            
            <Stack direction="row" spacing={2}>
                <Button 
                    variant="outlined" 
                    startIcon={<AttachMoneyIcon />}
                    onClick={() => setIsPaymentModalOpen(true)}
                    sx={{ 
                        textTransform: 'none', 
                        fontWeight: 600,
                        borderColor: '#D1D5DB',
                        color: '#374151',
                        '&:hover': { borderColor: '#9CA3AF', bgcolor: '#F9FAFB' }
                    }}
                >
                    Add Payment
                </Button>
                <Button 
                    variant="contained" 
                    startIcon={<AddIcon />}
                    onClick={() => setIsGoalModalOpen(true)}
                    sx={{ 
                        textTransform: 'none', 
                        fontWeight: 600,
                        bgcolor: '#2563EB',
                        boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)',
                        '&:hover': { bgcolor: '#1D4ED8' }
                    }}
                >
                    New Goal
                </Button>
            </Stack>
        </Box>

        {/* --- MODALE --- */}
        <GoalModal 
            open={isGoalModalOpen} 
            onClose={() => { setIsGoalModalOpen(false); setEditingGoal(null); }} 
            onGoalAdded={fetchGoals} 
            goalToEdit={editingGoal} 
        />
        
        <PaymentModal 
            open={isPaymentModalOpen} 
            onClose={() => setIsPaymentModalOpen(false)} 
            onPaymentCreated={fetchGoals} 
            allGoals={goals} 
        />
        
        <GoalDetailedInfoModal 
            openedGoal={openedGoal} 
            onClose={() => setOpenedGoal(null)} 
        />

        {/* --- TREŚĆ --- */}
        {!loading && !error && (
            <Box>
                {goals.length === 0 ? (
                    <Paper 
                        elevation={0}
                        sx={{ 
                            p: 10, 
                            textAlign: 'center', 
                            borderRadius: 4, 
                            bgcolor: '#FFFFFF', 
                            border: '1px dashed #E5E7EB' 
                        }}
                    >
                        <Typography variant="h6" sx={{ color: '#9CA3AF', mb: 2 }}>
                            You don't have any savings goals yet.
                        </Typography>
                        <Button 
                            variant="text" 
                            onClick={() => setIsGoalModalOpen(true)}
                            sx={{ textTransform: 'none', fontWeight: 600 }}
                        >
                            Create your first goal
                        </Button>
                    </Paper>
                ) : (
                    <Grid container spacing={3}>
                        {goals.map(goal => (
                            <Grid item xs={12} sm={6} md={4} xl={3} key={goal.id}>
                                <GoalCard 
                                    goal={goal} 
                                    onDelete={fetchGoals} 
                                    onEdit={handleEdit} 
                                    onOpen={handleOpen}
                                />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
        )}
    </Box>
  );
}