import AppRoutes from './routes';
import './index.css';

const App: React.FC = () => {
  return (
    <div className="app-container">
      <header className="app-header">
        <h2>DRS Quiz Platform</h2>
      </header>
      <main className="app-main">
        <AppRoutes />
      </main>
      <footer className="app-footer">
        <p>&copy; 2026 DRS Platform</p>
      </footer>
    </div>
  );
};

export default App;
