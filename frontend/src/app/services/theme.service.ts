import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {

    constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

    private currentThemeSubject = new BehaviorSubject<'light' | 'dark'>('light');
    currentTheme$ = this.currentThemeSubject.asObservable();

    checkPreferred(): 'light' | 'dark' {
        if (isPlatformBrowser(this.platformId)) {
            const sessionTheme: 'light' | 'dark' = sessionStorage.getItem('preferredTheme') as 'light' | 'dark';
        
            if (sessionTheme) {
                this.changeTheme(sessionTheme);
                return sessionTheme;
            } 
            else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                this.changeTheme('dark');
                sessionStorage.setItem('preferredTheme', 'dark');
                return 'dark';
            } 
            else {
                this.changeTheme('light');
                sessionStorage.setItem('preferredTheme', 'light');
                return 'light';
            }
        }
        return 'light';
    }
    

    changeTheme(theme: 'light' | 'dark') {
        if (isPlatformBrowser(this.platformId)) {
            this.currentThemeSubject.next(theme);
            sessionStorage.setItem('preferredTheme', theme)
            if (theme === "light")
                document.body.classList.remove('darkMode')
            else
                document.body.classList.add('darkMode')            
        }
    }
}
