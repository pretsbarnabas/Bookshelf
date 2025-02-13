import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/components/layout/app.component';
import { appConfig } from './app/app.config';
import { provideConfig } from './app/services/config.service';

fetch('./assets/config.json')
  .then((response) => {
    if (!response.ok) {
      throw new Error('Failed to load configuration');
    }
    return response.json();
  })
  .then((config) => {
    bootstrapApplication(AppComponent, {
      providers: [
        ...appConfig.providers,
        provideConfig(config),
      ]
    }).catch((err) => console.error(err));
  })
  .catch((error) => {
    console.error('Error loading configuration:', error);
  });
