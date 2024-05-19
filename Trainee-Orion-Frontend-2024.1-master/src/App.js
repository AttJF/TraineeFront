import { Button } from '@mui/material';
import './App.css';
import { useEffect, useState } from 'react';
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import { Box, ThemeProvider, createTheme } from '@mui/system';
import { amber } from '@mui/material/colors';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

export function BoxSx({ color }) {
  return (
    <ThemeProvider
      theme={{
        palette: {
          primary: {
            main: '#007FFF',
            dark: '#0066CC',
          },
        },
      }}
    >
      <Box
        sx={{
          width: 100,
          height: 100,
          borderRadius: 1,
          bgcolor: amber,
          '&:hover': {
            bgcolor: 'primary.dark',
          },
        }}
      />
    </ThemeProvider>
  );
}

function CustomTabPanel(props) {
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

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function App() {
  const [people, setPeople] = useState([]);
  const [showBooks, setShowBooks] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [value, setValue] = React.useState(0);
  const [book, setBook] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("http://localhost/api/person");
      const data = await response.json();
      setPeople(data);
      setBook(await (await fetch("http://localhost/api/book")).json());
    }
    fetchData();
  }, []);

  const theme = createTheme({
    palette: {
      background: {
        paper: '#eee',
        pink: 'pink',
      },
      text: {
        primary: '#FF007F',
        secondary: '#46505A',
      },
      action: {
        active: '#001E3C',
      },
      success: {
        dark: '#009688',
      },
      tableCellBackground: 'lightyellow', // Nova cor para as células da tabela
    },
  });

  async function showPBooks(personId) {
    const response = await fetch(`http://localhost/api/person/${personId}`);
    if (response.ok) {
      const data = await response.json();
      setSelectedPerson(data);
      setShowBooks(true);
      setDialogOpen(true); // Abrir a caixa de diálogo quando os livros da pessoa são exibidos
    } else {
      console.error("Erro ao buscar os livros da pessoa", response.statusText);
    }
  }

  return (
    <Box sx={{ width: '100%', bgcolor: 'pink' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'pink' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Pessoa" />
          <Tab label="Livro" />
        </Tabs>
      </Box>
      <div className="App">
        <CustomTabPanel value={value} index={0}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell sx={{ bgcolor: theme.palette.tableCellBackground }} align="right">Sobrenome</TableCell>
                  <TableCell align="right">Gênero</TableCell>
                  <TableCell sx={{ bgcolor: theme.palette.tableCellBackground }} align="right">Endereço</TableCell>
                  <TableCell align="right">ID</TableCell>
                  <TableCell sx={{ bgcolor: theme.palette.tableCellBackground }} align="right">LINK</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {people.map((person, index) => (
                  <TableRow
                    key={person.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>{person.firstName}</TableCell>
                    <TableCell sx={{ bgcolor: theme.palette.tableCellBackground }} align="right">{person.lastName}</TableCell>
                    <TableCell align="right">{person.gender}</TableCell>
                    <TableCell sx={{ bgcolor: theme.palette.tableCellBackground }} align="right">{person.address}</TableCell>
                    <TableCell align="right">{person.id}</TableCell>
                    <TableCell sx={{ bgcolor: theme.palette.tableCellBackground }} align="right">
                      <Button variant='contained' onClick={() => showPBooks(person.id)}>Livros</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CustomTabPanel>

        <CustomTabPanel value={value} index={1}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Autor</TableCell>
                  <TableCell align="right">Data de Lançamento</TableCell>
                  <TableCell sx={{ bgcolor: theme.palette.tableCellBackground }} align="right">preco</TableCell>
                  <TableCell align="right">titulo</TableCell>
                  <TableCell sx={{ bgcolor: theme.palette.tableCellBackground }} align="right">ID</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {book.map((book, index) => (
                  <TableRow
                    key={book.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>{book.author}</TableCell>
                    <TableCell sx={{ bgcolor: theme.palette.tableCellBackground }} align="right">{book.launchDate}</TableCell>
                    <TableCell align="right">R$:{book.price}</TableCell>
                    <TableCell sx={{ bgcolor: theme.palette.tableCellBackground }} align="right">{book.title}</TableCell>
                    <TableCell align="right">{book.id}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CustomTabPanel>
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>Livros - {selectedPerson && `${selectedPerson.firstName} ${selectedPerson.lastName}`}</DialogTitle>
          <DialogContent>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Autor</TableCell>
                    <TableCell align="right">Data de Lançamento</TableCell>
                    <TableCell sx={{ bgcolor: theme.palette.tableCellBackground }} align="right">Preço</TableCell>
                    <TableCell align="right">Título</TableCell>
                    <TableCell sx={{ bgcolor: theme.palette.tableCellBackground }} align="right">ID</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedPerson && selectedPerson.books.map((book) => (
                    <TableRow key={book.id}>
                      <TableCell>{book.author}</TableCell>
                      <TableCell align="right">{book.launchDate}</TableCell>
                      <TableCell sx={{ bgcolor: theme.palette.tableCellBackground }} align="right">R$ {book.price}</TableCell>
                      <TableCell align="right">{book.title}</TableCell>
                      <TableCell sx={{ bgcolor: theme.palette.tableCellBackground }} align="right">{book.id}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Fechar</Button>
          </DialogActions>
        </Dialog>

      </div>
    </Box >
  );
}

export default App;
