import * as React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export type ProtectedRouteProps = { children?: React.ReactElement } & {
  isAllowed: boolean;
  redirectPath?: string;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  isAllowed,
  children,
  redirectPath = '/',
}) => {
  const location = useLocation();

  if (!isAllowed) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return children ?? <Outlet />;
};
