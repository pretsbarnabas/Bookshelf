import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {

    constructor() { }

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
        if (theme === "light")
            document.body.classList.remove('darkMode')
        else
            document.body.classList.add('darkMode')
    }

    changeEyeSaveMode(isOn: boolean) {
        this.isEyeSaveModeOnSubject.next(isOn);
        sessionStorage.setItem('isEyeSaveModeOn', isOn.toString())
        if (isOn)
            document.body.classList.add('eyeSaverMode')
        else
            document.body.classList.remove('eyeSaverMode')
    }

    changeColorBlindessMode(type: string) {
        this.removeColorOverlays();
        switch (type) {
            case "red-green":
                localStorage.setItem("colorBlindnessMode", type);
                document.body.classList.add('colorblind-red-green');
                break;
            case "blue-yellow":
                localStorage.setItem("colorBlindnessMode", type);
                document.body.classList.add('colorblind-blue-yellow');
                break;
            case "monochrome":
                localStorage.setItem("colorBlindnessMode", type);
                document.body.classList.add('colorblind-monochrome');
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
        document.body.classList.remove('colorblind-red-green');
        document.body.classList.remove('colorblind-blue-yellow');
        document.body.classList.remove('colorblind-monochrome');
    }
}
