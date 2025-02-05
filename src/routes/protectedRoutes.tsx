import React, {useEffect} from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import authActions from "../hooks/useAuthActions";

interface ProtectedRouteProps {
    component: React.ComponentType;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component }) => {
    const useAuthActions = authActions();

    const {isAuthenticated, isProcessing, user} = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        isAuthenticated === true && !user?.email?.length && useAuthActions.fetchActiveUser();
    }, [isAuthenticated]);

    if(isProcessing === true){
        return <span>Validating ... </span>
    }

    return isAuthenticated ? <Component /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
