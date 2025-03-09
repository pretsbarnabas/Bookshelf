import { APP_BASE_HREF } from '@angular/common';
import express from 'express';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { bootstrapApp } from './main.server';
import { enableProdMode } from '@angular/core';

enableProdMode();

interface RenderOptions {
    req: express.Request;
    res?: express.Response;
    providers?: Array<any>;
}


async function app(): Promise<express.Express> {
    const server = express();
    const distFolder = join(process.cwd(), 'dist/frontend/browser');

    console.log('[SERVER] Initializing SSR server...');
    console.log(`[SERVER] Environment: ${process.env['NODE_ENV'] || 'development'}`)

    if (!existsSync(distFolder)) {
        throw new Error(`Client build missing at ${distFolder}. Run client build first!`);
    }

    const indexHtmlPath = join(distFolder,
        existsSync(join(distFolder, 'index.original.html'))
            ? 'index.original.html'
            : 'index.html'
    );

    if (!existsSync(indexHtmlPath)) {
        throw new Error(`Missing index.html at ${indexHtmlPath}`);
    }

    server.use('/assets', express.static(join(__dirname, 'dist/frontend/server/assets')));

    server.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.error('[SERVER ERROR]', err);
        res.status(500).send('Internal Server Error');
    });

    server.engine('html', async (_, options, callback) => {
        try {
            const html = await bootstrapApp((options as RenderOptions).req.url);
            callback(null, html);
        } catch (error) {
            console.error('SSR Rendering Error:', error);
            callback(null, `
            <html>
              <body>
                <h1>500 Server Error</h1>
                <pre>${error}</pre>
              </body>
            </html>
          `);
        }
    });

    server.set('view engine', 'html');
    server.set('views', distFolder);

    server.get('*.*', express.static(distFolder, { maxAge: '1y' }));

    server.get('*', async (req, res) => {
        res.render(
            existsSync(join(distFolder, 'index.original.html'))
                ? 'index.original.html'
                : 'index',
            {
                req,
                providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }]
            }
        );
    });

    server.listen(process.env['PORT'] || 4000, () => {
        console.log(`[SERVER] Running on http://localhost:${process.env['PORT'] || 4000}`);
    });


    return server;
}

export default app();