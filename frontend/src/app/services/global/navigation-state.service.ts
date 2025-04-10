import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import * as CryptoJS from "crypto-js";

export interface RouteState {
    id: string;
    data: any;
}

@Injectable({
    providedIn: 'root'
})
export class NavigationStateService {
    private storageKey = 'appNavigationState';
    private encryptionKey = 'YOUR_SECRET_KEY';
    private state: { [route: string]: RouteState } = {};

    private stateSubject = new BehaviorSubject<{ [route: string]: RouteState }>(this.loadState());

    constructor() { }

    getStateObservable(route: string): Observable<RouteState | undefined> {
        return this.stateSubject.asObservable().pipe(
            map(state => state[route]),
            distinctUntilChanged()
        );
    }
    setState(route: string, id: string, data: any): void {
        this.state[route] = { id, data };
        this.saveState();
        this.stateSubject.next({ ...this.state });
    }

    clearState(route?: string): void {
        if (route) {
            delete this.state[route];
        } else {
            this.state = {};
        }
        this.saveState();
        this.stateSubject.next({ ...this.state });
    }

    private saveState(): void {
        try {
            const encrypted = CryptoJS.AES.encrypt(JSON.stringify(this.state), this.encryptionKey).toString();
            localStorage.setItem(this.storageKey, encrypted);
        } catch (e) {
        }
    }

    private loadState(): { [route: string]: RouteState } {
        try {
            const encrypted = localStorage.getItem(this.storageKey);
            if (encrypted) {
                const bytes = CryptoJS.AES.decrypt(encrypted, this.encryptionKey);
                const decrypted = bytes.toString(CryptoJS.enc.Utf8);
                return JSON.parse(decrypted);
            }
        } catch (e) {
            this.state = {};
        }
        return this.state;
    }
}
