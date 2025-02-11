import { ClerkProvider, SignIn, SignUp, SignedIn, SignedOut } from '@clerk/clerk-react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';

if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

function App() {
  return (
    <ClerkProvider 
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
      navigate={(to) => window.location.href = to}
    >
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <SignedIn>
                  <Dashboard />
                </SignedIn>
                <SignedOut>
                  <Navigate to="/sign-in" replace />
                </SignedOut>
              </>
            }
          />

          <Route
            path="/sign-in/*"
            element={
              <SignedOut>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                  <SignIn 
                    routing="path" 
                    path="/sign-in" 
                    signUpUrl="/sign-up"
                    appearance={{
                      elements: {
                        rootBox: "mx-auto",
                        card: "bg-white shadow-xl rounded-lg",
                      }
                    }}
                  />
                </div>
              </SignedOut>
            }
          />
          <Route
            path="/sign-up/*"
            element={
              <SignedOut>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                  <SignUp 
                    routing="path" 
                    path="/sign-up" 
                    signInUrl="/sign-in"
                    appearance={{
                      elements: {
                        rootBox: "mx-auto",
                        card: "bg-white shadow-xl rounded-lg",
                      }
                    }}
                  />
                </div>
              </SignedOut>
            }
          />
        </Routes>
      </BrowserRouter>
    </ClerkProvider>
  );
}

export default App;

