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
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Product } from '../../types';
import { productsService } from '../../services/api';

interface ProductsListProps {
    products: Product[];
}

const validationSchema = yup.object({
    name: yup.string().required('El nombre es requerido'),
    description: yup.string().required('La descripción es requerida'),
    price: yup.number().required('El precio es requerido').min(0, 'El precio debe ser mayor o igual a 0'),
    stock: yup.number().required('El stock es requerido').min(0, 'El stock debe ser mayor o igual a 0'),
});

const ProductsList: React.FC<ProductsListProps> = ({ products: initialProducts }) => {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [open, setOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
            price: 0,
            stock: 0,
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                if (editingProduct) {
                    const updatedProduct = await productsService.updateProduct(editingProduct.id, values);
                    setProducts(products.map(product => 
                        product.id === updatedProduct.id ? updatedProduct : product
                    ));
                } else {
                    const newProduct = await productsService.createProduct(values);
                    setProducts([...products, newProduct]);
                }
                handleClose();
            } catch (error) {
                console.error('Error al guardar el producto:', error);
            }
        },
    });

    const handleClickOpen = () => {
        setEditingProduct(null);
        formik.resetForm();
        setOpen(true);
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        formik.setValues({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
        });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingProduct(null);
        formik.resetForm();
    };

    const handleDelete = async (id: number) => {
        try {
            await productsService.deleteProduct(id);
            setProducts(products.filter(product => product.id !== id));
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Lista de Productos</Typography>
                <Button variant="contained" onClick={handleClickOpen}>
                    Agregar Producto
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Descripción</TableCell>
                            <TableCell>Precio</TableCell>
                            <TableCell>Stock</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.description}</TableCell>
                                <TableCell>${product.price.toFixed(2)}</TableCell>
                                <TableCell>{product.stock}</TableCell>
                                <TableCell>
                                    <Button
                                        size="small"
                                        onClick={() => handleEdit(product)}
                                        sx={{ mr: 1 }}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        size="small"
                                        color="error"
                                        onClick={() => handleDelete(product.id)}
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
                    {editingProduct ? 'Editar Producto' : 'Agregar Producto'}
                </DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="Nombre"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="description"
                            label="Descripción"
                            name="description"
                            multiline
                            rows={3}
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            error={formik.touched.description && Boolean(formik.errors.description)}
                            helperText={formik.touched.description && formik.errors.description}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="price"
                            label="Precio"
                            name="price"
                            type="number"
                            value={formik.values.price}
                            onChange={formik.handleChange}
                            error={formik.touched.price && Boolean(formik.errors.price)}
                            helperText={formik.touched.price && formik.errors.price}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="stock"
                            label="Stock"
                            name="stock"
                            type="number"
                            value={formik.values.stock}
                            onChange={formik.handleChange}
                            error={formik.touched.stock && Boolean(formik.errors.stock)}
                            helperText={formik.touched.stock && formik.errors.stock}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={() => formik.handleSubmit()} variant="contained">
                        {editingProduct ? 'Guardar' : 'Agregar'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ProductsList; 