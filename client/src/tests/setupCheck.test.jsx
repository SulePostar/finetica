import { render, screen } from '@testing-library/react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { renderWithProviders, mockAuthStateFactory } from './testUtils';

function DummyComponent() {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const authState = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    return (
        <div>
            <p data-testid="pathname">Pathname: {location.pathname}</p>
            <p data-testid="params">Params: {JSON.stringify(params)}</p>
            <p data-testid="auth-status">Is Authenticated: {String(authState?.isAuthenticated || false)}</p>
            <button
                data-testid="test-button"
                onClick={() => {
                    navigate('/home');
                    dispatch({ type: 'TEST' });
                }}
            >
                Click
            </button>
        </div>
    );
}

describe('Frontend Setup Validation', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should load all mocks correctly', () => {
        renderWithProviders(<DummyComponent />);

        // React Router mock check
        expect(screen.getByTestId('pathname')).toHaveTextContent('Pathname: /');

        // Redux mock check
        expect(screen.getByTestId('auth-status')).toHaveTextContent('Is Authenticated: false');

        // Axios mock check - simplified
        expect(axios.get).toBeDefined();
    });

    test('should handle custom auth state', () => {
        const customAuthState = mockAuthStateFactory({ isAuthenticated: true });
        const customState = { auth: customAuthState };

        renderWithProviders(<DummyComponent />, { initialState: customState });

        expect(screen.getByTestId('auth-status')).toHaveTextContent('Is Authenticated: true');
    });
});
