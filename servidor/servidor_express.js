import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'bienvenida.html'));
});

app.get('/api/usuarios', (req, res) => {
  const usuarios = {
    usuarios: [
      { nombre: 'Punk', saldo: '0' },
      { nombre: 'Hongo', saldo: '1' }
    ]
  };
  res.json(usuarios);
});

app.get('/api/movimientos', (req, res) => {
  const movimientos = {
    movimientos: [
      { tipo: 'ingreso', monto: 500 },
      { tipo: 'egreso', monto: 200 },
      { tipo: 'ingreso', monto: 300 }
    ]
  };
  res.json(movimientos);
});

app.get('/api/prestamos', (req, res) => {
  const prestamos = {
    prestamos: [
      { usuario: 'Punk', monto: '100' },
      { usuario: 'Hongo', monto: '1000' }
    ]
  };
  res.json(prestamos);
});

app.get('/usuarios', (req, res) => {
  res.sendFile(path.join(__dirname, 'usuarios.html'));
});

app.get('/movimientos', (req, res) => {
  res.sendFile(path.join(__dirname, 'movimientos.html'));
});

app.get('/perfil', (req, res) => {
  res.sendFile(path.join(__dirname, 'perfil.html'));
});

app.get('/equipo', (req, res) => {
  res.sendFile(path.join(__dirname, 'equipo.html'));
});

app.get('/prestamos', (req, res) => {
  res.sendFile(path.join(__dirname, 'prestamos.html'));
});

app.get('/opinion', (req, res) => {
  res.sendFile(path.join(__dirname, 'opinion.html'));
});

app.use((req, res) => {
  res.status(404).send('Hmmmm.. no encontraste la página? Ajá.. y si la encuentro yo, que te hago? >:c');
});

const puerto = 1984;
app.listen(puerto, () => {
  console.log(`Servidor escuchando en el puerto ${puerto}`);
});
