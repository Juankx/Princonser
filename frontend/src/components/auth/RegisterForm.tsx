import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
    Box,
    Button,
    TextField,
    Typography,
    Container,
    Paper,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/api';
import { es } from 'date-fns/locale';

const validationSchema = yup.object({
    full_name: yup.string().required('El nombre completo es requerido'),
    birth_date: yup.date().required('La fecha de nacimiento es requerida'),
    country: yup.string().required('El país es requerido'),
    email: yup.string().email('Correo electrónico inválido').required('El correo electrónico es requerido'),
    phone: yup.string(),
    password: yup.string().min(8, 'La contraseña debe tener al menos 8 caracteres').required('La contraseña es requerida'),
});

const RegisterForm: React.FC = () => {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            full_name: '',
            birth_date: null as Date | null,
            country: '',
            email: '',
            phone: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                await authService.register({
                    ...values,
                    birth_date: values.birth_date?.toISOString().split('T')[0] || '',
                });
                navigate('/login');
            } catch (error) {
                console.error('Error al registrarse:', error);
                // TODO: Mostrar mensaje de error
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
                        Registro
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={formik.handleSubmit}
                        sx={{ mt: 1, width: '100%' }}
                    >
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="full_name"
                            label="Nombre Completo"
                            name="full_name"
                            autoComplete="name"
                            autoFocus
                            value={formik.values.full_name}
                            onChange={formik.handleChange}
                            error={formik.touched.full_name && Boolean(formik.errors.full_name)}
                            helperText={formik.touched.full_name && formik.errors.full_name}
                        />
                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                            <DatePicker
                                label="Fecha de Nacimiento"
                                value={formik.values.birth_date}
                                onChange={(date) => formik.setFieldValue('birth_date', date)}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        margin: 'normal',
                                        error: formik.touched.birth_date && Boolean(formik.errors.birth_date),
                                        helperText: formik.touched.birth_date && formik.errors.birth_date,
                                    },
                                }}
                            />
                        </LocalizationProvider>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="country"
                            label="País"
                            name="country"
                            value={formik.values.country}
                            onChange={formik.handleChange}
                            error={formik.touched.country && Boolean(formik.errors.country)}
                            helperText={formik.touched.country && formik.errors.country}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Correo Electrónico"
                            name="email"
                            autoComplete="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            id="phone"
                            label="Teléfono"
                            name="phone"
                            autoComplete="tel"
                            value={formik.values.phone}
                            onChange={formik.handleChange}
                            error={formik.touched.phone && Boolean(formik.errors.phone)}
                            helperText={formik.touched.phone && formik.errors.phone}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Contraseña"
                            type="password"
                            id="password"
                            autoComplete="new-password"
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
                            Registrarse
                        </Button>
                        <Button
                            fullWidth
                            variant="text"
                            onClick={() => navigate('/login')}
                        >
                            ¿Ya tienes cuenta? Inicia sesión
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default RegisterForm; 