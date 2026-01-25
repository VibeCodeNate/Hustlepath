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
import { Settings } from './pages/Settings';
import { ExtraObjectives } from './pages/ExtraObjectives';
import { Earnings } from './pages/Earnings';
import { Goals } from './pages/Goals';
import { Shop } from './pages/Shop';
import { Profile } from './pages/Profile';

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
              <ProtectedRoute requirePro={true}>
                <Explainer />
              </ProtectedRoute>
            } />
            <Route path="/success" element={
              <ProtectedRoute>
                <Success />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute requirePro={true}>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/roadmap" element={
              <ProtectedRoute requirePro={true}>
                <Roadmap />
              </ProtectedRoute>
            } />
            <Route path="/character" element={
              <ProtectedRoute requirePro={true}>
                <CharacterPage />
              </ProtectedRoute>
            } />
            <Route path="/community" element={
              <ProtectedRoute requirePro={true}>
                <Community />
              </ProtectedRoute>
            } />
            <Route path="/resources" element={
              <ProtectedRoute requirePro={true}>
                <Resources />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/extra-objectives" element={
              <ProtectedRoute requirePro={true}>
                <ExtraObjectives />
              </ProtectedRoute>
            } />
            <Route path="/earnings" element={
              <ProtectedRoute requirePro={true}>
                <Earnings />
              </ProtectedRoute>
            } />
            <Route path="/goals" element={
              <ProtectedRoute requirePro={true}>
                <Goals />
              </ProtectedRoute>
            } />
            <Route path="/shop" element={
              <ProtectedRoute requirePro={true}>
                <Shop />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/profile/:userId" element={
              <ProtectedRoute requirePro={true}>
                <Profile />
              </ProtectedRoute>
            } />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;

