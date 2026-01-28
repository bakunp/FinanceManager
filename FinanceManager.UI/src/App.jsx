import { useState, useEffect } from 'react'
import GoalModal from './components/GoalModal';
import GoalCard from './components/GoalCard';
import { getAllGoals } from './services/goalService';
import { Box } from '@mui/material';
import PaymentModal from './components/PaymentModal';

function App() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingGoal, setEditingGoal] = useState(null);

  const handleEdit = (goal) => {
      setEditingGoal(goal);
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

return (
    <div style={{ maxWidth: "1600px", margin: "0 auto", padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <h1 style={{ textAlign: "center", color: "#333", marginBottom: "30px" }}>Finance Manager</h1>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
            <GoalModal onGoalAdded={fetchGoals} goalToEdit={editingGoal} onClose={() => setEditingGoal(null)} />
            <PaymentModal onPaymentCreated={fetchGoals} allGoals={goals} />
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
                <GoalCard key={goal.id} goal={goal} onDelete={fetchGoals} onEdit={handleEdit}/>
              ))
            )}
          </div>
        )}
    </div>
  );
}

export default App