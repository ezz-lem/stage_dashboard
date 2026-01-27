import { HashRouter } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import { DataProvider } from './context/DataContext';
import AppRouter from './router/AppRouter';

function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <DataProvider>
          <AppRouter />
        </DataProvider>
      </AuthProvider>
    </HashRouter>
  );
}

export default App;
