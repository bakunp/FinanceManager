export const modalBoxStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 400 },
    bgcolor: 'background.paper',
    borderRadius: 3,
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    gap: 2.5,
    outline: 'none',
};

export const wideModalBoxStyle = {
    ...modalBoxStyle,
    width: { xs: '95%', sm: 600 },
    maxHeight: '90vh',
    overflow: 'hidden',
};
