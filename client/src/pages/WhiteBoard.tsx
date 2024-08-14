import { ArrowBack } from '@mui/icons-material';
import { Button } from '@mui/material';
import { Users } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import Whiteboard from '../components/whiteBoard';
import { useUser } from '../context/userProvider';
import { useEffect } from 'react';
import axios from 'axios';

function WhiteBoard() {
    const { navigateTo, user } = useUser();
    const location = useLocation();
    useEffect(() => {
        const boardInfo = async () => {
            try {
                if (!location.state.board.id) {
                    return;
                }
                const res = await axios.get(`http://localhost:7000/api/v1/board/${location.state.board.id}`)
                console.log(res)
            } catch (error) {
                console.log(error);
            }
        }
        boardInfo();
    }, [])

    const back = async () => {
        console.log("back")
        try {
            const res = await axios.put(`http://localhost:7000/api/v1/board/leave/${location.state.board.id}`, {
                participantId: user?.id
            })
            console.log(res)
        } catch (error) {
            console.log(error);
        }
        navigateTo('/dashboard')
    }
    return (
        <div className="relative overflow-auto">
            <nav className="absolute top-0 px-5 flex w-full justify-between items-center z-10 bg-transparent">
                <Button onClick={back} className="flex gap-2 justify-center items-center">
                    <ArrowBack />
                    <h1 className="text-xl font-medium">Back</h1>
                </Button>
                <h1 className="text-2xl font-medium">{location.state.board.name}</h1>
                <Button className='!px-4 !py-4 !rounded-full '>
                    <Users size={33} className='m-0' />
                </Button>
            </nav>
            <Whiteboard />
        </div>
    );
}

export default WhiteBoard;
