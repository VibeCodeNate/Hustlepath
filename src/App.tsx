import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Landing } from './pages/Landing';
import { Assessment } from './pages/Assessment';
import { Results } from './pages/Results';
import { Explainer } from './pages/Explainer';
import { Success } from './pages/Success';
import { Dashboard } from './pages/Dashboard';
import { SignUp } from './pages/SignUp';
import { Login } from './pages/Login';
import { ResetPassword } from './pages/ResetPassword';
import { Roadmap } from './pages/Roadmap';
import { CharacterPage } from './pages/CharacterPage';
import { Community } from './pages/Community';
import { Resources } from './pages/Resources';

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected routes - require auth */}
            <Route path="/results" element={
              <ProtectedRoute>
                <Results />
              </ProtectedRoute>
            } />
            <Route path="/explainer" element={
              <ProtectedRoute>
                <Explainer />
              </ProtectedRoute>
            } />
            <Route path="/success" element={
              <ProtectedRoute>
                <Success />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/roadmap" element={
              <ProtectedRoute>
                <Roadmap />
              </ProtectedRoute>
            } />
            <Route path="/character" element={
              <ProtectedRoute>
                <CharacterPage />
              </ProtectedRoute>
            } />
            <Route path="/community" element={
              <ProtectedRoute>
                <Community />
              </ProtectedRoute>
            } />
            <Route path="/resources" element={
              <ProtectedRoute>
                <Resources />
              </ProtectedRoute>
            } />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
