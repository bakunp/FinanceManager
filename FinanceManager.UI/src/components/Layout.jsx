import { Outlet, Link, useLocation } from "react-router-dom";
import { 
    AppBar, Box, CssBaseline, Drawer, Toolbar, List, Typography, 
    ListItem, ListItemButton, ListItemIcon, ListItemText, Container 
} from "@mui/material";
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

const drawerWidth = 240;

export default function Layout() {
    const location = useLocation();

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
        { text: 'Fixed Expenses', icon: <ReceiptLongIcon />, path: '/expenses' },
    ];

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">
                        Finance Manager
                    </Typography>
                </Toolbar>
            </AppBar>

            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        {menuItems.map((item) => (
                            <ListItem key={item.text} disablePadding>
                                <ListItemButton 
                                    component={Link} 
                                    to={item.path}
                                    selected={location.pathname === item.path}
                                >
                                    <ListItemIcon>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>

            <Box 
                component="main" 
                sx={{ 
                    flexGrow: 1, 
                    p: 3, 
                    minHeight: '100vh', 
                    display: 'flex', 
                    flexDirection: 'column',
                    bgcolor: '#f5f5f5'
                }}
            >
                <Toolbar />
                
                <Container maxWidth="xl" sx={{ flexGrow: 1, mb: 4 }}>
                    <Outlet />
                </Container>

                <Box component="footer" sx={{ py: 2, textAlign: 'center', color: 'text.secondary', borderTop: '1px solid #e0e0e0' }}>
                    <Typography variant="body2">
                        Finance Manager footer
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}