import http from 'http';
import axios from 'axios';
import url from 'url';

const servidor = http.createServer((req, res) => {
  //console.log(req);
  const urlProcesada = url.parse(req.url, true);
  //console.log(urlProcesada);
  const queryParams = urlProcesada.query;
  console.log(queryParams.x);
  console.log(queryParams.x);
  console.log("Alguien me mandó una solicitud");
  axios.get('https://www.theaudiodb.com/api/v1/json/123/search.php?s=maneskin')
  .then(response => {
    console.log('Si');  
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(response.data.artists[0].strBiography)
  })
  .catch(error => {
    console.error('Error:', error);
  });
});

const puerto = 1984;

servidor.listen(puerto, () => {
  console.log(`Servidor escuchando en el puerto ${puerto}`);
});
