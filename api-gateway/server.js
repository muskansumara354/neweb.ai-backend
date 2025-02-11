// server.js (or app.js)
require('dotenv').config();
const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 8000;

// --------------------------------------
// Proxy configurations for backend services
// --------------------------------------
app.use('/user', createProxyMiddleware({
  target: process.env.USER_SERVICE_URL, // e.g., http://localhost:8001
  changeOrigin: true,
  pathRewrite: { '^/user': '' },
}));



// --------------------------------------
// Handling Frontend Requests
// --------------------------------------

// In development, proxy all other requests to the Vite dev server.
if (process.env.NODE_ENV === 'development') {
  app.use(
    '/',
    createProxyMiddleware({
      target: 'http://localhost:5173', // default Vite dev server port
      changeOrigin: true,
      ws: true,
    })
  );
} else {

app.get('*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

}

// --------------------------------------
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
