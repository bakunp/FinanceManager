import { Outlet, Link, useLocation } from "react-router-dom";
import { 
    AppBar, Box, Drawer, Toolbar, List, Typography, 
    ListItem, ListItemButton, ListItemIcon, ListItemText, Container, Avatar, Divider, IconButton, useTheme
} from "@mui/material";
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useColorMode } from "../theme";

const drawerWidth = 280;

export default function Layout() {
    const location = useLocation();
    const theme = useTheme();
    const colorMode = useColorMode();

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
        { text: 'Fixed Expenses', icon: <ReceiptLongIcon />, path: '/expenses' },
    ];

    return (
        <Box sx={{ display: 'flex' }}>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { 
                        width: drawerWidth, 
                        boxSizing: 'border-box',
                        bgcolor: 'background.paper', 
                        borderRight: '1px solid',
                        borderColor: 'divider'
                    },
                }}
            >
                <Toolbar sx={{ display: 'flex', alignItems: 'center', px: 3, py: 4, gap: 2, minHeight: 100 }}>
                    <Avatar sx={{ bgcolor: 'transparent', width: 40, height: 40, border: '2px solid #3B82F6', color: '#3B82F6' }}>
                        <AccountBalanceWalletIcon fontSize="small" />
                    </Avatar>
                    <Typography variant="h6" noWrap component="div" sx={{ color: 'text.primary', fontWeight: 700, letterSpacing: 0.5 }}>
                        Finance<span style={{ color: theme.palette.primary.main }}>Manager</span>
                    </Typography>
                </Toolbar>
                
                <Divider sx={{ mb: 2 }} />

                <Box sx={{ overflow: 'auto', px: 2, mt: 2 }}>
                    <List>
                        {menuItems.map((item) => (
                            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                                <ListItemButton 
                                    component={Link} 
                                    to={item.path}
                                    selected={location.pathname === item.path}
                                    sx={{
                                        borderRadius: 3,
                                        py: 1.5,
                                        '&.Mui-selected': {
                                            bgcolor: 'action.selected',
                                            color: 'primary.main',
                                            '& .MuiListItemIcon-root': { color: 'primary.main' }
                                        },
                                        '&:hover': {
                                            bgcolor: 'action.hover',
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
                    <Typography variant="caption" display="block" sx={{ color: 'text.disabled', textAlign: 'center' }}>
                        v1.0.0
                    </Typography>
                </Box>
            </Drawer>

            <Box 
                component="main" 
                sx={{ 
                    flexGrow: 1, 
                    bgcolor: 'background.default', 
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <AppBar 
                    position="sticky" 
                    elevation={0}
                    sx={{ 
                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(2, 6, 23, 0.8)' : 'rgba(241, 245, 249, 0.8)',
                        backdropFilter: 'blur(8px)',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        color: 'text.primary'
                    }}
                >
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.01em' }}>
                            {menuItems.find(i => i.path === location.pathname)?.text || 'Dashboard'}
                        </Typography>
                        <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
                            {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                        </IconButton>
                    </Toolbar>
                </AppBar>

                <Container maxWidth={false} sx={{ flexGrow: 1, p: 4, maxWidth: '1600px' }}>
                    <Outlet />
                </Container>
            </Box>
        </Box>
    );
}