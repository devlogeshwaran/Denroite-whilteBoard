import { Link } from "react-router-dom";
import { useUser } from "../context/userProvider";

function ProtectedRoutes({ children }: { children: React.ReactNode; }) {
    const { user } = useUser();
    if (user?.isLoggedIn) {
        return <>{children}</>;
    }

    return (
        <div className="flex flex-col h-[100vh] items-center justify-center gap-1">
            <p className="text-2xl font-bold">OOPS!! You don't have access</p>
            <Link to='/login'>Back to Login</Link>
        </div>
    );
}

export default ProtectedRoutes;
