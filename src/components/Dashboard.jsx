import { useState, useEffect } from "react";
import styles from "./styles.module.css";

const Dashboard = ({ user, onLogout, onNavigateToProfile }) => {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
  });

  useEffect(() => {
    // Simulate loading user stats
    const loadStats = () => {
      setStats({
        totalTasks: 12,
        completedTasks: 8,
        pendingTasks: 4,
      });
    };

    loadStats();
  }, []);

  const completionRate =
    stats.totalTasks > 0
      ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
      : 0;

  return (
    <div className={styles.container}>
      <div className={styles.dashboard}>
        <header className={styles.header}>
          <h1 className={styles.title}>Dashboard</h1>
          <div className={styles.userInfo}>
            <span>Welcome, {user?.name || "User"}!</span>
            <button className={styles.logoutBtn} onClick={onLogout}>
              Logout
            </button>
          </div>
        </header>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h3>Total Tasks</h3>
            <div className={styles.statNumber}>{stats.totalTasks}</div>
          </div>

          <div className={styles.statCard}>
            <h3>Completed</h3>
            <div className={styles.statNumber}>{stats.completedTasks}</div>
          </div>

          <div className={styles.statCard}>
            <h3>Pending</h3>
            <div className={styles.statNumber}>{stats.pendingTasks}</div>
          </div>

          <div className={styles.statCard}>
            <h3>Completion Rate</h3>
            <div className={styles.statNumber}>{completionRate}%</div>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.primaryBtn} onClick={onNavigateToProfile}>
            View Profile
          </button>
          <button className={styles.secondaryBtn}>Add New Task</button>
        </div>

        <div className={styles.recentActivity}>
          <h3>Recent Activity</h3>
          <ul className={styles.activityList}>
            <li>Task "Complete project setup" was completed</li>
            <li>Task "Write documentation" was created</li>
            <li>Task "Review code" was updated</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

