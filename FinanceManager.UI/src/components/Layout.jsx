import { Outlet, Link, useLocation } from "react-router-dom";
import { 
    AppBar, Box, CssBaseline, Drawer, Toolbar, List, Typography, 
    ListItem, ListItemButton, ListItemIcon, ListItemText, Container, Avatar, Divider
} from "@mui/material";
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const drawerWidth = 260;

export default function Layout() {
    const location = useLocation();

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
        { text: 'Fixed Expenses', icon: <ReceiptLongIcon />, path: '/expenses' },
    ];

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { 
                        width: drawerWidth, 
                        boxSizing: 'border-box',
                        bgcolor: '#111827', 
                        color: '#9CA3AF',
                        borderRight: 'none'
                    },
                }}
            >
                <Toolbar sx={{ display: 'flex', alignItems: 'center', px: 2, gap: 2 }}>
                    <Avatar sx={{ bgcolor: '#3B82F6', width: 32, height: 32 }}>
                        <AccountBalanceWalletIcon fontSize="small" />
                    </Avatar>
                    <Typography variant="h6" noWrap component="div" sx={{ color: '#F9FAFB', fontWeight: 700, letterSpacing: 0.5 }}>
                        FinanceManager
                    </Typography>
                </Toolbar>
                
                <Divider sx={{ borderColor: '#374151', mb: 2 }} />

                <Box sx={{ overflow: 'auto', px: 2 }}>
                    <List>
                        {menuItems.map((item) => (
                            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                                <ListItemButton 
                                    component={Link} 
                                    to={item.path}
                                    selected={location.pathname === item.path}
                                    sx={{
                                        borderRadius: 2,
                                        '&.Mui-selected': {
                                            bgcolor: '#1F2937',
                                            color: '#60A5FA',
                                            '& .MuiListItemIcon-root': { color: '#60A5FA' }
                                        },
                                        '&:hover': {
                                            bgcolor: '#1F2937',
                                            color: '#F3F4F6'
                                        }
                                    }}
                                >
                                    <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary={item.text} 
                                        primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
                
                <Box sx={{ mt: 'auto', p: 2 }}>
                    <Typography variant="caption" display="block" sx={{ color: '#4B5563', textAlign: 'center' }}>
                        v1.0.0
                    </Typography>
                </Box>
            </Drawer>

            <Box 
                component="main" 
                sx={{ 
                    flexGrow: 1, 
                    bgcolor: '#F3F4F6', 
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <AppBar 
                    position="sticky" 
                    elevation={0} 
                    sx={{ 
                        bgcolor: '#FFFFFF', 
                        borderBottom: '1px solid #E5E7EB',
                        color: '#111827'
                    }}
                >
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600, fontSize: 18 }}>
                            {menuItems.find(i => i.path === location.pathname)?.text || 'Dashboard'}
                        </Typography>
                    </Toolbar>
                </AppBar>

                <Container maxWidth={false} sx={{ flexGrow: 1, p: 4, maxWidth: '1600px' }}>
                    <Outlet />
                </Container>
            </Box>
        </Box>
    );
}