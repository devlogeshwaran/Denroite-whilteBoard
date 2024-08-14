import React, { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import { useUser } from '../context/userProvider';
import axios from 'axios';

interface Prop {
    className: string;
    createBoard: boolean;
}

const NewBoard: React.FC<Prop> = (props) => {
    const { user, navigateTo, boards, setUserBoards } = useUser();
    const [name, setBoardName] = useState<string>();
    const [boardId, setBoardId] = useState<string>();
    const [errors, setErrors] = useState<string>("")
    const [password, setPassword] = useState<string>();

    const handleCreateRoom = async () => {
        if (!password) {
            setErrors("password cannot be empty")
            return;
        }
        const id = user?.id
        if (props.createBoard) {
            try {
                const date = new Date()
                const res = await axios.post('http://localhost:7000/api/v1/board', {
                    id: `${id}` + date.getDate() + date.getMonth() + date.getFullYear() + date.getHours() + date.getMinutes(),
                    createdBy: user?.id,
                    name: name || user?.id,
                    password,
                });
                console.log(res.data);
                navigateTo(`/whiteboard/${res.data.board.id}`)
            } catch (error) {
                console.error('Error creating room:', error);
            } finally {
                return;
            }
        }

        try {
            const res = await axios.put('http://localhost:7000/api/v1/board', {
                id: user?.id,
                boardId,
                password,
            });
            console.log(res.data);
            navigateTo(`/whiteboard/${res.data.board.id}`, {
                state: {
                    board: res.data.board
                }
            })
        } catch (error) {
            console.error('Error creating room:', error);
        } finally {
            return;
        }
    }

    return (
        <div className={`flex flex-col items-center justify-center gap-2 ${props.className}`}>
            <Typography variant="h4" gutterBottom> {props.createBoard ? "Create" : "Join"} a Collaborative Board </Typography>
            <div className="flex flex-col gap-5">
                {
                    props.createBoard ? (
                        <TextField
                            label="Board Name"
                            variant="outlined"
                            value={name}
                            onChange={(e) => setBoardName(e.target.value)}
                            className='w-64 m-0'
                            InputProps={{
                                sx: {
                                    '& .MuiInputBase-input': {
                                        color: 'white',
                                    },
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'white',
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'sky-blue',
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'blue',
                                    },
                                },
                            }}
                            InputLabelProps={{
                                sx: {
                                    color: 'white',
                                },
                            }}
                            FormHelperTextProps={{
                                sx: {
                                    color: 'white',
                                },
                            }}
                        />
                    ) : (
                        <TextField
                            label="Board Id"
                            variant="outlined"
                            value={name}
                            onChange={(e) => setBoardId(e.target.value)}
                            className='w-64 m-0'
                            InputProps={{
                                sx: {
                                    '& .MuiInputBase-input': {
                                        color: 'white',
                                    },
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'white',
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'blue',
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'blue',
                                    },
                                },
                            }}
                            InputLabelProps={{
                                sx: {
                                    color: 'white',
                                },
                            }}
                            FormHelperTextProps={{
                                sx: {
                                    color: 'white',
                                },
                            }}
                        />
                    )
                }
                <TextField
                    label="Password"
                    variant="outlined"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-64 m-0"
                    InputProps={{
                        sx: {
                            '& .MuiInputBase-input': {
                                color: 'white',
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'white',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'blue',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'blue',
                            },
                        },
                    }}
                    InputLabelProps={{
                        sx: {
                            color: 'white',
                        },
                    }}
                    FormHelperTextProps={{
                        sx: {
                            color: 'white',
                        },
                    }}
                />


                <p className="text-red-400 text-lg">{errors}</p>
            </div>
            <Button variant="contained" onClick={handleCreateRoom} className="absolute" >{props.createBoard ? "Create" : "Join"} Board</Button>
        </div>
    );
};

export default NewBoard;
