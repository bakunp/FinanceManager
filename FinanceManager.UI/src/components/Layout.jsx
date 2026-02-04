import { AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material";
import { Link, Outlet } from "react-router";


export default function Layout() {
    return(
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar position="static" color="default" elevation={1}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                        Finance Manager
                    </Typography> 
                    <Button color="inherit" component={Link} to="/">Dashboard</Button>
                    <Button color="inherit" component={Link} to="/expenses">Fixed expenses</Button>
                </Toolbar>
            </AppBar>

            <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
                <Outlet/>
            </Container>

            <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: '#e0e0e0', textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                    Finance Manager footer
                </Typography>
            </Box>
        </Box>
    )
}