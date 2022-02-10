import React, {FC, useState} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

interface ModalAuthProps{
    modalState: boolean
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}


const ModalAuth:FC<ModalAuthProps> = (modalState) => {
    const [open, setOpen] = React.useState(false);
    const modalClose = () => setOpen(false);

    const [value, setValue] = React.useState(0);

    const tabChange = (event: React.SyntheticEvent, newValue: number) => {setValue(newValue);};

    const [inputLogin,setInputLogin] = useState<string>('');
    const [inputEmail,setInputEmail] = useState<string>('');
    const [inputPassword,setInputPassword] = useState<string>('');

    const styleModal = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: '5px',
        p: 4,
    };

    function TabPanel(props: TabPanelProps) {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{ p: 3 }}>
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    }

    function tabProps(index: number) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    console.log(inputLogin)

    function GetInputLogin (e:any){
        setInputLogin(e.target.value)
    }
    return (
        <div>
            <Modal
                open={open}
                onClose={modalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styleModal}>
                    <h3>Для просмотра нужно войти или зарегистриворать на сайте</h3>
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={value} onChange={tabChange} aria-label="basic tabs example">
                                <Tab label="Войти" {...tabProps(0)} />
                                <Tab label="Регистрация" {...tabProps(1)} />
                            </Tabs>
                        </Box>
                        <TabPanel value={value} index={0}>
                            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                <TextField
                                    id="outlined-name"
                                    label="Логин"
                                    required={true}
                                />
                                <TextField
                                    id="outlined-name"
                                    label="Пароль"
                                    type="password"
                                    style={{'margin':'10px 0'}}
                                    required={true}
                                />
                                <Button variant="contained" style={{'display': 'block'}} type={"submit"}>Войти</Button>
                            </Typography>
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <TextField
                                id="outlined-name"
                                label="Логин"
                                required={true}
                                onInput={GetInputLogin}
                            />
                            <TextField
                                id="outlined-name"
                                label="Email"
                                style={{'margin':'10px 0 0 0'}}
                                required={true}
                            />
                            <TextField
                                id="outlined-name"
                                label="Пароль"
                                type="password"
                                style={{'margin':'10px 0'}}
                                required={true}
                            />
                            <Button variant="contained" style={{'display': 'block'}}>Регистрация</Button>
                        </TabPanel>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
};

export default ModalAuth;