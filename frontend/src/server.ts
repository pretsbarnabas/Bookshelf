import { APP_BASE_HREF } from '@angular/common';
import express from 'express';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import bootstrap from './main.server';

interface RenderOptions {
    req: express.Request;
    res?: express.Response;
    providers?: Array<any>;
}

export async function app(): Promise<express.Express> {
    const server = express();
    const distFolder = join(process.cwd(), 'dist/frontend/browser');

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

    server.engine('html', async (_, options, callback) => {
        try {
            const html = await bootstrap((options as RenderOptions).req.url);
            callback(null, html);
        } catch (error) {
            callback(error);
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

    return server;
}