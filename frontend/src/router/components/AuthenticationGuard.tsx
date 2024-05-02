import * as React from 'react';
import { useAuth } from '../../auth/provider/auth';
import { ProtectedRoute } from './ProtectedRoute';

export type AuthenticationGuardProps = {
  children?: React.ReactElement;
  redirectPath?: string;
};

export const AuthenticationGuard: React.FC<AuthenticationGuardProps> = ({
  redirectPath = '/login',
  ...props
}) => {
  const { isAuthenticated } = useAuth();

  return (
    <ProtectedRoute redirectPath={redirectPath} isAllowed={isAuthenticated} {...props} />
  );
};

export const UnAuthenticationGuard: React.FC<AuthenticationGuardProps> = ({
  redirectPath = '/',
  ...props
}) => {
  const { isAuthenticated } = useAuth();

  return (
    <ProtectedRoute redirectPath={redirectPath} isAllowed={!isAuthenticated} {...props} />
  );
};
