import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { LogOut, Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="h-16 bg-card border-b border-border px-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <h2 className="text-lg font-semibold text-foreground">
          Welcome back, {user?.fullName}
        </h2>
        <Badge variant="secondary" className="capitalize">
          {user?.role?.toLowerCase()}
        </Badge>
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            3
          </Badge>
        </Button>
        
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </header>
  );
};

export default Header;