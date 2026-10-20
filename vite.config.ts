import 'dotenv/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

function apiDevServerPlugin(): Plugin {
  return {
    name: 'api-dev-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        // Buffer request body
        const chunks: Buffer[] = [];
        for await (const chunk of req) {
          chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
        }
        const bodyStr = Buffer.concat(chunks).toString('utf-8');
        let body = {};
        if (bodyStr) {
          try {
            body = JSON.parse(bodyStr);
          } catch {
            body = {};
          }
        }
        (req as any).body = body;

        // Vercel response adapter
        const vercelRes: any = res;
        vercelRes.status = (code: number) => {
          res.statusCode = code;
          return vercelRes;
        };
        vercelRes.json = (data: any) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
          return vercelRes;
        };

        try {
          if (req.url.startsWith('/api/cloudinary/sign')) {
            const { default: signHandler } = await import('./api/cloudinary/sign.ts');
            return await signHandler(req as any, vercelRes);
          } else if (req.url.startsWith('/api/cloudinary/delete')) {
            const { default: deleteHandler } = await import('./api/cloudinary/delete.ts');
            return await deleteHandler(req as any, vercelRes);
          }
        } catch (err: any) {
          console.error('API middleware error:', err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiDevServerPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
