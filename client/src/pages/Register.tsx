import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { Button, TextField, IconButton, InputAdornment, FormControl, InputLabel, OutlinedInput, FormHelperText, Alert, CircularProgress } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { registerSchema } from '../utils/formSchema';
import { useUser } from '../context/userProvider';
import axios from 'axios';
import { AlertType } from '../utils/types';

export default function Register() {
  const { setUserState, navigateTo, user } = useUser();

  if (user?.isLoggedIn) {
    navigateTo('/dashboard')
  }

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AlertType>({
    state: false,
    content: "",
    type: undefined
  });

  useEffect(() => {
    setTimeout(() => {
      setAlert({
        state: false,
        content: "",
        type: undefined
      })
    }, 3000);
  }, [alert]);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      mobileNumber: ''
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setLoading(true)
    const { name, mobileNumber, email, password } = values;
    try {
      const res = await axios.post('http://localhost:7000/api/v1/auth/signup', {
        email,
        password,
        name,
        mobileNumber
      })

      if (res.status === 201) {
        setUserState({
          isLoggedIn: true,
          id: res.data.user.id,
          name: res.data.user.name,
          email: res.data.user.email,
          mobileNumber: res.data.user.mobileNumber
        })
        navigateTo('/dashboard')
      }
    } catch (error: any) {
      const code = error.response.status;
      if (code === 303) {
        setAlert({
          state: true,
          content: error.response.data.message,
          type: "warning"
        })
      }
      else if (code === 500) {
        setAlert({
          state: true,
          content: error.response.data.message,
          type: "info"
        })
      } else {
        setAlert({
          state: true,
          content: "Sorry Something went Wrong",
          type: "info"
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className='flex h-svh w-svw items-center justify-center bg-slate-900 text-white'>
        {
          alert.state ?
            < Alert variant="filled" severity={alert.type} className="absolute right-5 bottom-5 !pe-20"> {alert.content} </Alert>
            : null
        }
        <div className='flex min-w-[400px] flex-col gap-4'>
          <h1 className='text-2xl font-bold'>Create your Zween White Board account</h1>
          <p className='mb-3'>
            Already have an account?{' '}
            <Link to='/login' className='text-blue-500'>
              Sign in
            </Link>
            .
          </p>
          <form onSubmit={registerForm.handleSubmit(onSubmit)} className='flex flex-col gap-1'>
            <TextField
              label='Name'
              {...registerForm.register('name')}
              error={!!registerForm.formState.errors.name}
              helperText={registerForm.formState.errors.name?.message}
              fullWidth
              variant='outlined'
              margin='normal'
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
            />

            <TextField
              label='Email'
              {...registerForm.register('email')}
              error={!!registerForm.formState.errors.email}
              helperText={registerForm.formState.errors.email?.message}
              fullWidth
              variant='outlined'
              margin='normal'
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
            />

            <TextField
              label='Mobile Number'
              {...registerForm.register('mobileNumber')}
              error={!!registerForm.formState.errors.mobileNumber}
              helperText={registerForm.formState.errors.mobileNumber?.message}
              fullWidth
              variant='outlined'
              margin='normal'
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
            />

            <FormControl variant="outlined" fullWidth margin='normal'>
              <InputLabel sx={{ color: 'white' }}>Password</InputLabel>
              <OutlinedInput
                type={showPassword ? 'text' : 'password'}
                {...registerForm.register('password')}
                error={!!registerForm.formState.errors.password}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <Visibility sx={{ color: 'white' }} /> : <VisibilityOff sx={{ color: 'white' }} />}
                    </IconButton>
                  </InputAdornment>
                }
                sx={{
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
                }}
                label='Password'
              />
              <FormHelperText sx={{ color: 'white' }} error={!!registerForm.formState.errors.password}>
                {registerForm.formState.errors.password?.message}
              </FormHelperText>
            </FormControl>

            <FormControl variant="outlined" fullWidth margin='normal'>
              <InputLabel sx={{ color: 'white' }}>Confirm Password</InputLabel>
              <OutlinedInput
                type={showConfirmPassword ? 'text' : 'password'}
                {...registerForm.register('confirmPassword')}
                error={!!registerForm.formState.errors.confirmPassword}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <Visibility sx={{ color: 'white' }} /> : <VisibilityOff sx={{ color: 'white' }} />}
                    </IconButton>
                  </InputAdornment>
                }
                sx={{
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
                }}
                label='Confirm Password'
              />
              <FormHelperText sx={{ color: 'white' }} error={!!registerForm.formState.errors.confirmPassword}>
                {registerForm.formState.errors.confirmPassword?.message}
              </FormHelperText>
            </FormControl>

            <Button type='submit' variant='contained' color='primary' className='mt-4' disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Create Account"}
            </Button>
          </form>
          <p className='text-sm'>
            By signing up, you agree to our{' '}
            <Link to={`/terms`} className='text-blue-500'>
              terms
            </Link>
            , {'and '}
            <Link to={`/privacy`} className='text-blue-500'>
              privacy policy
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
