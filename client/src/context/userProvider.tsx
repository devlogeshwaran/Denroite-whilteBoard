import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Board, User } from '../utils/types';
import { useNavigate, NavigateFunction, useLocation } from 'react-router-dom';

interface UserContextProps {
    user: User | null;
    boards: Board[] | null;
    setUserState: (user: User) => void;
    setUserBoards: (boards: Board[]) => void;
    navigateTo: NavigateFunction;
    logout: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
    const location = useLocation();
    const navigateTo = useNavigate()
    const [user, setUser] = useState<User | null>(null);
    const [boards, setBoards] = useState<Board[] | null>(null);

    useEffect(() => {
        const user = localStorage.getItem('user');
        const boards = localStorage.getItem('boards');
        if (user) {
            setUser(JSON.parse(user))
        }
        if (boards) {
            setBoards(JSON.parse(boards).board)
        }
    }, [location.pathname])

    const setUserState = (user: User) => {
        localStorage.setItem('user', JSON.stringify(user))
    };
    const setUserBoards = (board: Board[]) => {
        localStorage.setItem('boards', JSON.stringify({ board }))
    };

    const logout = () => {
        setUser(null);
        localStorage.clear()
        navigateTo('/')
    };

    return (
        <UserContext.Provider value={{ user, setUserState, navigateTo, logout, boards, setUserBoards }}>
            {children}
        </UserContext.Provider>
    );
};


export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};