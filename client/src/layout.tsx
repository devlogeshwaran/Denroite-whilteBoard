import { Routes, Route, } from 'react-router-dom';
import Register from './pages/Register';
import WhiteBoard from './pages/WhiteBoard';
import Login from './pages/Login';
import ProtectedRoutes from './components/protectedRoutes';
import { UserProvider } from './context/userProvider';
import Dashboard from './pages/dashboard';

function Layout() {
    return (
        <UserProvider>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/whiteboard" element={<ProtectedRoutes><WhiteBoard /></ProtectedRoutes>} />
                <Route path="/whiteboard/:id" element={<ProtectedRoutes><WhiteBoard /></ProtectedRoutes>} />
            </Routes>
        </UserProvider>
    )
}

export default Layout