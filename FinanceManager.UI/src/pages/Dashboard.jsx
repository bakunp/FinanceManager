import { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, Paper, Container, Stack, Divider, Fade, Alert, useTheme, Skeleton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import GoalCard from '../components/GoalCard';
import GoalModal from '../components/GoalModal';
import PaymentModal from '../components/PaymentModal';
import GoalDetailedInfoModal from '../components/GoalDetailedInfoModal';
import { getAllGoals } from '../services/goalService';

function GoalCardSkeleton() {
  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 5, border: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Skeleton variant="text" width={140} height={28} />
          <Skeleton variant="rounded" width={60} height={24} sx={{ mt: 1 }} />
        </Box>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Skeleton variant="circular" width={28} height={28} />
          <Skeleton variant="circular" width={28} height={28} />
        </Box>
      </Box>
      <Box sx={{ textAlign: 'center', my: 3 }}>
        <Skeleton variant="text" width={60} sx={{ mx: 'auto' }} />
        <Skeleton variant="text" width={120} height={40} sx={{ mx: 'auto' }} />
        <Skeleton variant="text" width={140} sx={{ mx: 'auto' }} />
      </Box>
      <Skeleton variant="text" width={80} />
      <Skeleton variant="rounded" height={12} sx={{ borderRadius: 5 }} />
      <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'flex-end' }}>
        <Skeleton variant="text" width={120} />
      </Box>
    </Paper>
  );
}

export default function Dashboard() {
  const theme = useTheme();
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
    const fullGoal = goals.find(g => g.id === goal.id);
    setOpenedGoal(fullGoal || goal);
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
        <Grid container alignItems="center" spacing={2} size={12}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Typography variant="h3" sx={{
              fontWeight: 900,
              letterSpacing: '-0.03em',
              mb: 1,
              background: theme.palette.mode === 'dark' ? 'linear-gradient(45deg, #E0E7FF 30%, #A5B4FC 90%)' : 'linear-gradient(45deg, #1E1B4B 30%, #4338CA 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Financial Goals
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem', maxWidth: '600px' }}>
              You have <strong>{goals.length}</strong> active savings targets.
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack direction="row" spacing={2} justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<AttachMoneyIcon />}
                onClick={() => setIsPaymentModalOpen(true)}
                sx={{
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  py: 1.2,
                  borderColor: 'divider',
                  color: 'text.secondary',
                  '&:hover': { bgcolor: 'action.hover', borderColor: 'text.primary' }
                }}
              >
                Add Payment
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setIsGoalModalOpen(true)}
                sx={{
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  py: 1.2,
                  background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)',
                  color: '#1E1B4B',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.35)',
                  '&:hover': { boxShadow: '0 8px 20px rgba(245, 158, 11, 0.45)' }
                }}
              >
                New Goal
              </Button>
            </Stack>
          </Grid>
        </Grid>
        <Divider sx={{ mt: 4 }} />
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

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>
      )}

      {loading ? (
        <Grid container spacing={4} size={12}>
          {[1, 2, 3].map(i => (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={i}>
              <GoalCardSkeleton />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Fade in={!loading}>
          <Box>
            {goals.length === 0 ? (
              <Paper
                elevation={0}
                sx={{
                  p: 8,
                  textAlign: 'center',
                  borderRadius: 6,
                  bgcolor: 'background.paper',
                  border: `2px dashed ${theme.palette.divider}`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <Box sx={{ bgcolor: 'background.elevated', p: 3, borderRadius: '50%', mb: 3 }}>
                  <AccountBalanceWalletIcon sx={{ fontSize: 48, color: 'primary.main' }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
                  No goals set yet
                </Typography>
                <Typography sx={{ color: 'text.secondary', mb: 4, maxWidth: 400 }}>
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
              <Grid container spacing={4} size={12}>
                {goals.map(goal => (
                  <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={goal.id}>
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