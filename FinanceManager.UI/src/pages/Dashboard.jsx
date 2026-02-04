
import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
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

  const handleEdit = (goal) => {
      setEditingGoal(goal);
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
    <>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
            <GoalModal onGoalAdded={fetchGoals} goalToEdit={editingGoal} onClose={() => setEditingGoal(null) } />
            <PaymentModal onPaymentCreated={fetchGoals} allGoals={goals} />
            <GoalDetailedInfoModal 
                openedGoal={openedGoal} 
                onClose={() => setOpenedGoal(null)} 
            />
        </Box>
        {!loading && !error && (
          <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(4, 1fr)", 
              gap: "20px" 
          }}>
            {goals.length === 0 ? (
              <p style={{ gridColumn: "1 / -1", textAlign: "center" }}>No goals found. Add one!</p>
            ) : (
              goals.map(goal => (
                <GoalCard key={goal.id} goal={goal} onDelete={fetchGoals} onEdit={handleEdit} onOpen={handleOpen}/>
              ))
            )}
          </div>
        )}
    </>
  );
}