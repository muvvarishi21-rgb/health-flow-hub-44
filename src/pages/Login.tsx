import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Activity, Loader2 } from 'lucide-react';

const Login: React.FC = () => {
  const { user, login, registerPatient, isLoading } = useAuth();
  const { toast } = useToast();
  
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    dob: '',
    gender: '',
    address: '',
    bloodGroup: '',
  });
  const [error, setError] = useState('');

  // Redirect if already logged in
  if (user && !isLoading) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!loginForm.email || !loginForm.password) {
      setError('Please fill in all fields');
      return;
    }

    const success = await login(loginForm.email, loginForm.password);
    
    if (success) {
      toast({
        title: 'Login Successful',
        description: 'Welcome to HAMS!',
      });
    } else {
      setError('Invalid email or password');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (registerForm.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const success = await registerPatient(registerForm);
    
    if (success) {
      toast({
        title: 'Registration Successful',
        description: 'Welcome to HAMS! You have been automatically logged in.',
      });
    } else {
      setError('Email already exists or registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-accent flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-4">
            <Activity className="h-10 w-10 text-primary" />
            <div className="text-left">
              <h1 className="text-2xl font-bold text-foreground">HAMS</h1>
              <p className="text-sm text-muted-foreground">Hospital Management System</p>
            </div>
          </div>
        </div>

        <Card className="shadow-card">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>
                  Access your HAMS account
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>
                </CardContent>

                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign In
                  </Button>
                </CardFooter>
              </form>

              {/* Demo credentials */}
              <CardContent className="pt-0">
                <div className="text-xs text-muted-foreground space-y-1">
                  <p className="font-semibold">Demo Credentials:</p>
                  <p>Admin: admin@hams.test / Admin@123</p>
                  <p>Doctor: drsmith@hams.test / Doctor@123</p>
                  <p>Patient: john@hams.test / Patient@123</p>
                </div>
              </CardContent>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register">
              <CardHeader>
                <CardTitle>Patient Registration</CardTitle>
                <CardDescription>
                  Create a new patient account
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleRegister}>
                <CardContent className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        placeholder="John Doe"
                        value={registerForm.fullName}
                        onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        placeholder="+1-555-0000"
                        value={registerForm.phone}
                        onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="regEmail">Email</Label>
                    <Input
                      id="regEmail"
                      type="email"
                      placeholder="john@example.com"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="regPassword">Password</Label>
                      <Input
                        id="regPassword"
                        type="password"
                        placeholder="••••••••"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={registerForm.confirmPassword}
                        onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input
                        id="dob"
                        type="date"
                        value={registerForm.dob}
                        onChange={(e) => setRegisterForm({ ...registerForm, dob: e.target.value })}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bloodGroup">Blood Group</Label>
                      <Input
                        id="bloodGroup"
                        placeholder="A+"
                        value={registerForm.bloodGroup}
                        onChange={(e) => setRegisterForm({ ...registerForm, bloodGroup: e.target.value })}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      placeholder="123 Main St, City, State"
                      value={registerForm.address}
                      onChange={(e) => setRegisterForm({ ...registerForm, address: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>
                </CardContent>

                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Account
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Login;