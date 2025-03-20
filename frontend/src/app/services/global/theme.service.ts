import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {

    constructor(@Inject(DOCUMENT) private document: Document) { }

    private currentThemeSubject = new BehaviorSubject<'light' | 'dark'>('light');
    currentTheme$ = this.currentThemeSubject.asObservable();

    private isEyeSaveModeOnSubject = new BehaviorSubject<boolean>(false);
    isEyeSaveModeOn$ = this.currentThemeSubject.asObservable();

    private colorBlindessModeSubject = new BehaviorSubject<"red-green" | "blue-yellow" | "monochrome" | "none">("none");
    colorBlindessMode$ = this.currentThemeSubject.asObservable();

    checkPreferredTheme(): 'light' | 'dark' {
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

    checkEyeSaverMode(): boolean {
        const isEyeSaveModeOn: boolean = sessionStorage.getItem('isEyeSaveModeOn') == 'true';

        if (isEyeSaveModeOn) {
            this.changeEyeSaveMode(isEyeSaveModeOn);
            return isEyeSaveModeOn;
        }
        this.changeEyeSaveMode(isEyeSaveModeOn);
        sessionStorage.setItem('isEyeSaveModeOn', isEyeSaveModeOn.toString());
        return isEyeSaveModeOn;
    }

    checkColorBlindnessMode(): string {
        const colorBlindnessMode: string = localStorage.getItem('colorBlindnessMode') ?? "none";

        if (colorBlindnessMode) {
            this.changeColorBlindessMode(colorBlindnessMode);
            return colorBlindnessMode;
        }
        this.changeColorBlindessMode(colorBlindnessMode);
        sessionStorage.setItem('colorBlindnessMode', colorBlindnessMode);
        return colorBlindnessMode;
    }

    changeTheme(theme: 'light' | 'dark') {
        this.currentThemeSubject.next(theme);
        sessionStorage.setItem('preferredTheme', theme)
        if (theme === "light") {
            this.document.body.classList.remove('darkMode')
            void this.document.body.offsetWidth
        }
        else
            this.document.body.classList.add('darkMode')
    }

    changeEyeSaveMode(isOn: boolean) {
        this.isEyeSaveModeOnSubject.next(isOn);
        sessionStorage.setItem('isEyeSaveModeOn', isOn.toString())
        if (isOn) {
            this.document.querySelector('#app')!.classList.add('eyeSaverMode')
            this.document.querySelectorAll('.cdk-overlay-container')!.forEach(m => m.classList.add('eyeSaverMode'))
        }
        else {
            this.document.querySelector('#app')!.classList.remove('eyeSaverMode')
            this.document.querySelectorAll('.cdk-overlay-container')!.forEach(m => m.classList.remove('eyeSaverMode'))
        }
    }

    changeColorBlindessMode(type: string) {
        this.removeColorOverlays();
        switch (type) {
            case "red-green":
                localStorage.setItem("colorBlindnessMode", type);
                this.document.querySelector('#app')!.classList.add('colorblind-red-green');
                this.document.querySelectorAll('.cdk-overlay-container')!.forEach(m => m.classList.add('colorblind-red-green'))
                break;
            case "blue-yellow":
                localStorage.setItem("colorBlindnessMode", type);
                this.document.querySelector('#app')!.classList.add('colorblind-blue-yellow');
                this.document.querySelectorAll('.cdk-overlay-container')!.forEach(m => m.classList.add('colorblind-blue-yellow'))

                break;
            case "monochrome":
                localStorage.setItem("colorBlindnessMode", type);
                this.document.querySelector('#app')!.classList.add('colorblind-monochrome');
                this.document.querySelectorAll('.cdk-overlay-container')!.forEach(m => m.classList.add('colorblind-monochrome'))
                break;
            default: {
                localStorage.setItem("wasColorBlindnessNone", "true")
                this.removeColorOverlays();
                break;
            }
        }
    }

    private removeColorOverlays() {
        localStorage.removeItem("colorBlindnessMode");
        this.document.querySelector('#app')!.classList.remove('colorblind-red-green');
        this.document.querySelector('#app')!.classList.remove('colorblind-blue-yellow');
        this.document.querySelector('#app')!.classList.remove('colorblind-monochrome');     
        this.document.querySelectorAll('.cdk-overlay-container')!.forEach(m => {
            m.classList.remove('colorblind-red-green');
            m.classList.remove('colorblind-blue-yellow');
            m.classList.remove('colorblind-monochrome');
        });   
    }
}
