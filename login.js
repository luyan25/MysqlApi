const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();

app.use(cors());
app.use(bodyParser.json());

const users = [
  { id: 1, userName: 'admin', password: '123456' },
  { id: 2, userName: 'user', password: 'use123' },
];

app.post('/api/login', (req, res) => {
  const { userName, password } = req.body;

  const user = users.find(u => u.userName === userName && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  const token = jwt.sign({ id: user.id, userName: user.userName }, 'secret', { expiresIn: '1h' });

  res.json({ token });
});

app.listen(3002, () => {
  console.log('Server started on port 3002');
});
