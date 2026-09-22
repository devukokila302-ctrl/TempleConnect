import path from 'path';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { createApiApp } from './server/app';

dotenv.config();

async function startServer() {
  const app = createApiApp();
  const PORT = 3000;

  // Static assets from /public/images
  app.use('/images', express.static(path.join(process.cwd(), 'public', 'images')));

  // ----------------------------------------------------
  // VITE MIDDLEWARE / SPA STATIC FALLBACK
  // ----------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TempleConnect full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
