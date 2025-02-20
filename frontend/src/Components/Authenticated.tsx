import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useUser } from '../context/user';

interface AuthenticatedProps {
  children: React.ReactNode;
  adminRequired?: boolean;
}

const Authenticated: React.FC<AuthenticatedProps> = ({ children, adminRequired = false }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useUser();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token || !isAuthenticated) {
      navigate('/user/login', { replace: true });
      return;
    }

    if (adminRequired && user?.role !== 'admin') {
      navigate('/', { replace: true });
      return;
    }
  }, [isAuthenticated, user, navigate, adminRequired]);

  if (!isAuthenticated) {
    return <div className="flex justify-center items-center h-screen">Redirecting to login...</div>;
  }

  if (adminRequired && user?.role !== 'admin') {
    return <div className="flex justify-center items-center h-screen">Unauthorized: Admin access required</div>;
  }

  return <>{children}</>;
};

export default Authenticated;
