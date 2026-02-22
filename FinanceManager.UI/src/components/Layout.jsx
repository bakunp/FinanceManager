import { Outlet, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
    AppBar, Box, Drawer, Toolbar, List, Typography,
    ListItem, ListItemButton, ListItemIcon, ListItemText, Container, Avatar, Divider, IconButton, useTheme, useMediaQuery
} from "@mui/material";
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { useColorMode } from "../theme";

const drawerWidth = 280;

export default function Layout({ onLogout, user }) {
    const location = useLocation();
    const theme = useTheme();
    const colorMode = useColorMode();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
        { text: 'Fixed Expenses', icon: <ReceiptLongIcon />, path: '/expenses' },
    ];

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : '?';

    const drawerContent = (
        <>
            <Toolbar sx={{ display: 'flex', alignItems: 'center', px: 3, py: 4, gap: 2, minHeight: 100 }}>
                <Avatar sx={{ bgcolor: 'transparent', width: 40, height: 40, border: '2px solid', borderColor: 'primary.main', color: 'primary.main' }}>
                    <AccountBalanceWalletIcon fontSize="small" />
                </Avatar>
                <Typography variant="h6" noWrap component="div" sx={{ color: 'text.primary', fontWeight: 700, letterSpacing: 0.5 }}>
                    Finance<span style={{ color: theme.palette.primary.main }}>Manager</span>
                </Typography>
            </Toolbar>

            {user && (
                <Box sx={{ px: 3, pb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar
                        src={user.picture}
                        sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: '0.9rem' }}
                    >
                        {userInitial}
                    </Avatar>
                    <Box sx={{ overflow: 'hidden' }}>
                        <Typography variant="body2" fontWeight="600" noWrap>{user.name}</Typography>
                        <Typography variant="caption" color="text.secondary" noWrap>{user.email}</Typography>
                    </Box>
                </Box>
            )}

            <Divider sx={{ mb: 2 }} />

            <Box sx={{ overflow: 'auto', px: 2, mt: 2, flexGrow: 1 }}>
                <List>
                    {menuItems.map((item) => (
                        <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                component={Link}
                                to={item.path}
                                selected={location.pathname === item.path}
                                onClick={isMobile ? handleDrawerToggle : undefined}
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

            <Divider />
            <Box sx={{ p: 2 }}>
                <ListItemButton
                    onClick={onLogout}
                    sx={{
                        borderRadius: 3,
                        py: 1.5,
                        color: 'text.secondary',
                        '&:hover': { bgcolor: 'error.main', color: 'white', '& .MuiListItemIcon-root': { color: 'white' } }
                    }}
                >
                    <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                        <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary="Logout"
                        primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}
                    />
                </ListItemButton>
            </Box>

            <Box sx={{ p: 2, pt: 0 }}>
                <Typography variant="caption" display="block" sx={{ color: 'text.disabled', textAlign: 'center' }}>
                    v1.0.0
                </Typography>
            </Box>
        </>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            {/* Mobile drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        bgcolor: 'background.paper',
                        borderRight: '1px solid',
                        borderColor: 'divider'
                    },
                }}
            >
                {drawerContent}
            </Drawer>

            {/* Desktop drawer */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', md: 'block' },
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
                {drawerContent}
            </Drawer>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    bgcolor: 'background.default',
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    width: { md: `calc(100% - ${drawerWidth}px)` }
                }}
            >
                <AppBar
                    position="sticky"
                    elevation={0}
                    sx={{
                        bgcolor: theme.palette.mode === 'dark'
                            ? 'rgba(15, 23, 42, 0.8)'
                            : 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(8px)',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        color: 'text.primary'
                    }}
                >
                    <Toolbar>
                        {isMobile && (
                            <IconButton
                                color="inherit"
                                edge="start"
                                onClick={handleDrawerToggle}
                                sx={{ mr: 2 }}
                            >
                                <MenuIcon />
                            </IconButton>
                        )}
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