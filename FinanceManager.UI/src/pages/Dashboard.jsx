import { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, Paper, Container, Stack, Divider, Fade } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
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
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setIsGoalModalOpen(true);
  };

  const handleOpen = (goal) => {
    setOpenedGoal(goal);
  };

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

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <Box sx={{ mb: 6 }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={12} md={8}>
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', mb: 1 }}>
              Financial Goals
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748B', fontSize: '1.1rem' }}>
              You have <strong>{goals.length}</strong> active savings targets.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack direction="row" spacing={2} justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<AttachMoneyIcon />}
                onClick={() => setIsPaymentModalOpen(true)}
                sx={{
                  borderRadius: 2.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  py: 1.2,
                  borderColor: '#E2E8F0',
                  color: '#475569',
                  '&:hover': { bgcolor: '#F1F5F9', borderColor: '#CBD5E1' }
                }}
              >
                Add Payment
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setIsGoalModalOpen(true)}
                sx={{
                  borderRadius: 2.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  py: 1.2,
                  bgcolor: '#2563EB',
                  boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.2)',
                  '&:hover': { bgcolor: '#1D4ED8', boxShadow: '0 20px 25px -5px rgba(37, 99, 235, 0.3)' }
                }}
              >
                New Goal
              </Button>
            </Stack>
          </Grid>
        </Grid>
        <Divider sx={{ mt: 4, borderColor: '#E2E8F0' }} />
      </Box>

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

      {!loading && !error && (
        <Fade in={!loading}>
          <Box>
            {goals.length === 0 ? (
              <Paper
                elevation={0}
                sx={{
                  p: 8,
                  textAlign: 'center',
                  borderRadius: 6,
                  bgcolor: '#FFFFFF',
                  border: '2px dashed #E2E8F0',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <Box sx={{ bgcolor: '#EFF6FF', p: 3, borderRadius: '50%', mb: 3 }}>
                  <AccountBalanceWalletIcon sx={{ fontSize: 48, color: '#3B82F6' }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#1E293B', mb: 1 }}>
                  No goals set yet
                </Typography>
                <Typography sx={{ color: '#64748B', mb: 4, maxWidth: 400 }}>
                  Start your financial journey by defining what you're saving for. It only takes a minute.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => setIsGoalModalOpen(true)}
                  sx={{ borderRadius: 3, px: 6, textTransform: 'none', fontWeight: 700 }}
                >
                  Create your first goal
                </Button>
              </Paper>
            ) : (
              <Grid container spacing={4}>
                {goals.map(goal => (
                  <Grid item xs={12} sm={6} lg={4} xl={3} key={goal.id}>
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
        </Fade>
      )}
    </Container>
  );
}