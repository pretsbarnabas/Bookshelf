import { renderApplication } from '@angular/platform-server';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/components/layout/app.component';
import { config } from './app/app.config.server';
import { join } from 'node:path';
import { readFileSync } from 'node:fs';

const indexHtmlPath = join(
    process.cwd(),
    'dist/frontend/browser/index.html'
);

const document = readFileSync(indexHtmlPath, 'utf-8');

export default async (url: string) => {
    return renderApplication(
        () => bootstrapApplication(AppComponent, config),
        {
            document,
            url,
            platformProviders: [
                { provide: 'REQUEST_URL', useValue: url }
            ]
        }
    );
};