import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
    Box,
    Button,
    TextField,
    Typography,
    Container,
    Paper,
    Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/api';

const validationSchema = yup.object({
    username: yup.string().required('El correo electrónico es requerido'),
    password: yup.string().required('La contraseña es requerida'),
});

const LoginForm: React.FC = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string>('');

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                setError('');
                const response = await authService.login(values);
                // Guardamos el token y el ID del usuario
                localStorage.setItem('token', response.access_token);
                localStorage.setItem('userId', response.user.id.toString());
                navigate('/dashboard');
            } catch (error: any) {
                console.error('Error al iniciar sesión:', error);
                setError(error.response?.data?.detail || 'Error al iniciar sesión. Por favor, verifica tus credenciales.');
            }
        },
    });

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        padding: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Iniciar Sesión
                    </Typography>
                    {error && (
                        <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
                            {error}
                        </Alert>
                    )}
                    <Box
                        component="form"
                        onSubmit={formik.handleSubmit}
                        sx={{ mt: 1, width: '100%' }}
                    >
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Correo Electrónico"
                            name="username"
                            autoComplete="email"
                            autoFocus
                            value={formik.values.username}
                            onChange={formik.handleChange}
                            error={formik.touched.username && Boolean(formik.errors.username)}
                            helperText={formik.touched.username && formik.errors.username}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Contraseña"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Iniciar Sesión
                        </Button>
                        <Button
                            fullWidth
                            variant="text"
                            onClick={() => navigate('/register')}
                        >
                            ¿No tienes cuenta? Regístrate
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default LoginForm; 