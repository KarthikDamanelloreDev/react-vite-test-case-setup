import { useState } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";

function App() {
  const [currentScreen, setCurrentScreen] = useState("login");
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser({
      name: userData.name || "User",
      email: userData.email,
      phone: "",
      bio: "",
      location: "",
    });
    setCurrentScreen("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentScreen("login");
  };

  const handleNavigateToProfile = () => {
    setCurrentScreen("profile");
  };

  const handleBackToDashboard = () => {
    setCurrentScreen("dashboard");
  };

  const handleSaveProfile = (profileData) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...profileData,
    }));
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "login":
        return <Login onLogin={handleLogin} />;
      case "dashboard":
        return (
          <Dashboard
            user={user}
            onLogout={handleLogout}
            onNavigateToProfile={handleNavigateToProfile}
          />
        );
      case "profile":
        return (
          <Profile
            user={user}
            onSave={handleSaveProfile}
            onBack={handleBackToDashboard}
          />
        );
      default:
        return <Login onLogin={handleLogin} />;
    }
  };

  return <>{renderScreen()}</>;
}

export default App;
