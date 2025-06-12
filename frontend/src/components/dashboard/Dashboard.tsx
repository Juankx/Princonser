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
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const data = await dashboardService.getDashboard();
                setDashboardData(data);
            } catch (error) {
                console.error('Error al cargar el dashboard:', error);
                // Si hay un error de autenticación, redirigir al login
                if (error.response?.status === 401) {
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [navigate]);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (loading) {
        return (
            <Container>
                <Typography>Cargando...</Typography>
            </Container>
        );
    }

    if (!dashboardData) {
        return (
            <Container>
                <Typography>Error al cargar los datos</Typography>
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
                                Bienvenido, {dashboardData.representative.full_name}
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
                            <ChildrenList children={dashboardData.children} />
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <ProductsList products={dashboardData.products} />
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                            <InvitationsList invitations={dashboardData.invitations} />
                        </TabPanel>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard; 