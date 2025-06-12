import React, { useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Child } from '../../types';
import { childrenService } from '../../services/api';

interface ChildrenListProps {
    children: Child[];
}

const validationSchema = yup.object({
    full_name: yup.string().required('El nombre completo es requerido'),
    birth_date: yup.date().required('La fecha de nacimiento es requerida'),
    country: yup.string().required('El país es requerido'),
});

const ChildrenList: React.FC<ChildrenListProps> = ({ children: initialChildren }) => {
    const [children, setChildren] = useState<Child[]>(initialChildren);
    const [open, setOpen] = useState(false);
    const [editingChild, setEditingChild] = useState<Child | null>(null);

    const formik = useFormik({
        initialValues: {
            full_name: '',
            birth_date: null as Date | null,
            country: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                if (editingChild) {
                    const updatedChild = await childrenService.updateChild(editingChild.id, {
                        ...values,
                        birth_date: values.birth_date?.toISOString().split('T')[0] || '',
                    });
                    setChildren(children.map(child => 
                        child.id === updatedChild.id ? updatedChild : child
                    ));
                } else {
                    const newChild = await childrenService.createChild({
                        ...values,
                        birth_date: values.birth_date?.toISOString().split('T')[0] || '',
                    });
                    setChildren([...children, newChild]);
                }
                handleClose();
            } catch (error) {
                console.error('Error al guardar el niño:', error);
            }
        },
    });

    const handleClickOpen = () => {
        setEditingChild(null);
        formik.resetForm();
        setOpen(true);
    };

    const handleEdit = (child: Child) => {
        setEditingChild(child);
        formik.setValues({
            full_name: child.full_name,
            birth_date: new Date(child.birth_date),
            country: child.country,
        });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingChild(null);
        formik.resetForm();
    };

    const handleDelete = async (id: number) => {
        try {
            await childrenService.deleteChild(id);
            setChildren(children.filter(child => child.id !== id));
        } catch (error) {
            console.error('Error al eliminar el niño:', error);
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Lista de Niños</Typography>
                <Button variant="contained" onClick={handleClickOpen}>
                    Agregar Niño
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Fecha de Nacimiento</TableCell>
                            <TableCell>País</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {children.map((child) => (
                            <TableRow key={child.id}>
                                <TableCell>{child.full_name}</TableCell>
                                <TableCell>{new Date(child.birth_date).toLocaleDateString()}</TableCell>
                                <TableCell>{child.country}</TableCell>
                                <TableCell>
                                    <Button
                                        size="small"
                                        onClick={() => handleEdit(child)}
                                        sx={{ mr: 1 }}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        size="small"
                                        color="error"
                                        onClick={() => handleDelete(child.id)}
                                    >
                                        Eliminar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    {editingChild ? 'Editar Niño' : 'Agregar Niño'}
                </DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="full_name"
                            label="Nombre Completo"
                            name="full_name"
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
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={() => formik.handleSubmit()} variant="contained">
                        {editingChild ? 'Guardar' : 'Agregar'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ChildrenList; 