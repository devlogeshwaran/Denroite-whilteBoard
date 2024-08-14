import { z } from "zod";

export const registerSchema = z.object({
    name: z.string()
        .min(3, {
            message: 'Name must be at least 3 characters long'
        }),
    email: z.string()
        .min(1, {
            message: 'Email is required'
        })
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            {
                message: 'Invalid email address'
            }),
    mobileNumber: z.string()
        .regex(/^[0-9]{10}$/,
            {
                message: 'Invalid mobile number'
            }),
    password: z.string()
        .min(8, {
            message: 'Password must be at least 8 characters long'
        }),
    confirmPassword: z.string()
        .min(8,
            {
                message: 'Confirm Password must be at least 8 characters long'
            })
}).refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
});


export const loginFormSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email address' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' }).max(64, { message: 'Password can be 64 characters maximum' }),
})
