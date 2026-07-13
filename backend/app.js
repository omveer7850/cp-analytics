const express = require('express');
const cors    = require('cors');

const atcoderRoutes  = require('./routes/atcoder.routes');
const githubRoutes   = require('./routes/github.routes');
const codechefRoutes = require('./routes/codechef.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/atcoder',  atcoderRoutes);
app.use('/api/github',   githubRoutes);
app.use('/api/codechef', codechefRoutes);
app.use('/api/contests', require('./routes/contests'));
app.get('/', (req, res) => {
  res.json({ status: 'CP Analytics Backend Running' });
});

module.exports = app;
