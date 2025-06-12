import React, { useState } from 'react';
import {
    Box,
    Button,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Snackbar,
    Alert,
} from '@mui/material';
import { Invitation } from '../../types';
import { invitationsService } from '../../services/api';

interface InvitationsListProps {
    invitations: Invitation[];
}

const InvitationsList: React.FC<InvitationsListProps> = ({ invitations: initialInvitations }) => {
    const [invitations, setInvitations] = useState<Invitation[]>(initialInvitations);
    const [open, setOpen] = useState(false);
    const [code, setCode] = useState('');
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error',
    });

    const handleCreateInvitation = async () => {
        try {
            const newInvitation = await invitationsService.createInvitation();
            setInvitations([...invitations, newInvitation]);
            setSnackbar({
                open: true,
                message: 'Invitación creada exitosamente',
                severity: 'success',
            });
        } catch (error) {
            console.error('Error al crear la invitación:', error);
            setSnackbar({
                open: true,
                message: 'Error al crear la invitación',
                severity: 'error',
            });
        }
    };

    const handleValidateInvitation = async () => {
        try {
            const invitation = await invitationsService.validateInvitation(code);
            setSnackbar({
                open: true,
                message: 'Código de invitación válido',
                severity: 'success',
            });
            setOpen(false);
            setCode('');
        } catch (error) {
            console.error('Error al validar la invitación:', error);
            setSnackbar({
                open: true,
                message: 'Código de invitación inválido',
                severity: 'error',
            });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Lista de Invitaciones</Typography>
                <Box>
                    <Button
                        variant="contained"
                        onClick={handleCreateInvitation}
                        sx={{ mr: 1 }}
                    >
                        Crear Invitación
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => setOpen(true)}
                    >
                        Validar Invitación
                    </Button>
                </Box>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Código</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Fecha de Creación</TableCell>
                            <TableCell>Fecha de Uso</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {invitations.map((invitation) => (
                            <TableRow key={invitation.id}>
                                <TableCell>{invitation.code}</TableCell>
                                <TableCell>
                                    {invitation.is_used ? 'Usada' : 'Disponible'}
                                </TableCell>
                                <TableCell>
                                    {new Date(invitation.created_at).toLocaleString()}
                                </TableCell>
                                <TableCell>
                                    {invitation.used_at
                                        ? new Date(invitation.used_at).toLocaleString()
                                        : '-'}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Validar Invitación</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="code"
                        label="Código de Invitación"
                        type="text"
                        fullWidth
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={handleValidateInvitation} variant="contained">
                        Validar
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default InvitationsList; 