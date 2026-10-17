const express = require('express');
const os = require('os');
const app = express();
const VERSION = process.env.APP_VERSION || 'v1';

// Log every request as one JSON line (used later in Logs Insights) 
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    console.log(JSON.stringify({
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration_ms: Date.now() - start,
      version: VERSION
    }));
  });
  next();
});
 
app.get('/', (req, res) => {
  //res.send(`<h1>Maansi App - ${VERSION}</h1><p>Served by: ${os.hostname()}</p>`);
    res.send(`<h1>Maansi App - ${VERSION}</h1><p>Release 6 auto triggered - deployed by pipeline</p><p>Served by: ${os.hostname()}</p>`);
});

app.get('/health', (req, res) => res.status(200).send('ok'));

// Burns CPU for ~300ms (for auto scaling test)
app.get('/load', (req, res) => {
  const end = Date.now() + 300;
  while (Date.now() < end) { Math.sqrt(Math.random()); }
  res.send('load done');
});

// Returns a 500 (for error-rate test)
app.get('/error', (req, res) => res.status(500).send('simulated error'));

app.listen(8080, '0.0.0.0', () => console.log('App listening on 8080'));
