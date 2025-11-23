import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard!</p>
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Total Users</h3>
          <p className="stat">1,234</p>
        </div>
        <div className="dashboard-card">
          <h3>Revenue</h3>
          <p className="stat">$12,345</p>
        </div>
        <div className="dashboard-card">
          <h3>Active Projects</h3>
          <p className="stat">42</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
