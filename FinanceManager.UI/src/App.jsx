import { useState, useEffect } from 'react'
import GoalModal from './components/GoalModal';
import GoalCard from './components/GoalCard';
import { getAllGoals } from './services/goalService';

function App() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#333" }}>Finance Manager</h1>
      <GoalModal onGoalAdded={fetchGoals}></GoalModal>

      {!loading && !error && (
        <div style={{ display: "grid", gap: "15px" }}>
          {goals.length === 0 ? (
            <p>Brak celów. Dodaj jakiś!</p>
          ) : (
            goals.map(goal => (
              <GoalCard key={goal.id} goal={goal} onDelete={fetchGoals}/>
            ))
          )}
          </div>
      )}
  </div>
);
}

export default App