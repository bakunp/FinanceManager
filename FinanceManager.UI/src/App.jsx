import { useState, useEffect } from 'react'

function App() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://localhost:7021/api/Goals')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error with API connection');
        }
        return response.json();
      })
      .then(data => {
        console.log("Data:", data);
        setGoals(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#333" }}>Finance Manager</h1>
      
      {/* status */}
      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}
      {error && <div style={{ color: "white", background: "red", padding: "10px", borderRadius: "5px" }}>Error: {error}</div>}

      {/* goals */}
      {!loading && !error && (
        <div style={{ display: "grid", gap: "15px" }}>
          {goals.length === 0 ? (
            <p>You have no goals! That's sad...</p>
          ) : (
            goals.map(goal => (
              <div key={goal.id} style={{ 
                border: "1px solid #ddd", 
                padding: "20px", 
                borderRadius: "10px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                backgroundColor: "#fff"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h2 style={{ margin: 0, fontSize: "1.2rem" }}>{goal.name}</h2>
                  <span style={{ background: "#e0e7ff", color: "#4338ca", padding: "4px 8px", borderRadius: "4px", fontSize: "0.8rem" }}>
                    Priority: {goal.priority}
                  </span>
                </div>
                
                <div style={{ marginTop: "15px", display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <small style={{ color: "#666" }}>Goal:</small>
                    <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>{goal.targetAmount} PLN</div>
                  </div>
                  <div>
                    <small style={{ color: "#666" }}>Current amount:</small>
                    <div style={{ fontWeight: "bold", fontSize: "1.1rem", color: goal.currentAmount >= goal.targetAmount ? "green" : "orange" }}>
                      {goal.currentAmount} PLN
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default App