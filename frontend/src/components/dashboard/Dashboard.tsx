import React, { useEffect, useState } from 'react';
import {
    Box,
    Container,
    Grid,
    Paper,
    Typography,
    Button,
    Tab,
    Tabs,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../../services/api';
import { DashboardData } from '../../types';
import ChildrenList from './ChildrenList';
import ProductsList from './ProductsList';
import InvitationsList from './InvitationsList';
import { Product, Invitation } from '../../types';
import { AxiosError } from 'axios';
import { productsService, invitationsService } from '../../services/api';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`dashboard-tabpanel-${index}`}
            aria-labelledby={`dashboard-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [value, setValue] = useState(0);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [representativeName, setRepresentativeName] = useState<string>('');

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const [productsData, invitationsData] = await Promise.all([
                    productsService.getProducts(),
                    invitationsService.getInvitations()
                ]);
                setProducts(productsData);
                setInvitations(invitationsData);
                // Obtener el nombre del representante del localStorage
                const userId = localStorage.getItem('userId');
                if (userId) {
                    // Por ahora, usamos un nombre genérico
                    setRepresentativeName('Usuario');
                }
            } catch (error) {
                console.error('Error al cargar el dashboard:', error);
                // Si hay un error de autenticación, redirigir al login
                if (error instanceof AxiosError && error.response?.status === 401) {
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, [navigate]);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/login');
    };

    if (loading) {
        return (
            <Container>
                <Typography>Cargando...</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography component="h1" variant="h4">
                                Bienvenido, {representativeName}
                            </Typography>
                            <Button variant="outlined" color="error" onClick={handleLogout}>
                                Cerrar Sesión
                            </Button>
                        </Box>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={value} onChange={handleChange} aria-label="dashboard tabs">
                                <Tab label="Niños" />
                                <Tab label="Productos" />
                                <Tab label="Invitaciones" />
                            </Tabs>
                        </Box>
                        <TabPanel value={value} index={0}>
                            <ChildrenList children={[]} />
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <ProductsList products={products} />
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                            <InvitationsList invitations={invitations} />
                        </TabPanel>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard; 