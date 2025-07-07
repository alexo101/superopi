import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/components/protected-route";
import NavBar from "@/components/nav-bar";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Upload from "@/pages/upload";
import Category from "@/pages/category";
import Auth from "@/pages/auth";
import Tops from "@/pages/tops";
import MyOpis from "@/pages/my-opis";
import TopBar from "@/components/top-bar";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={Auth} />
      <Route path="/">
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      </Route>
      <Route path="/upload">
        <ProtectedRoute>
          <Upload />
        </ProtectedRoute>
      </Route>
      <Route path="/category/:id">
        <ProtectedRoute>
          <Category />
        </ProtectedRoute>
      </Route>
      <Route path="/tops">
        <ProtectedRoute>
          <Tops />
        </ProtectedRoute>
      </Route>
      <Route path="/my-opis">
        <ProtectedRoute>
          <MyOpis />
        </ProtectedRoute>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen bg-background">
          <TopBar />
          <main className="max-w-6xl mx-auto px-4 py-4 pb-20">
            <Router />
          </main>
          <NavBar />
          <Toaster />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
