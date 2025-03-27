export function formatRemainingTime(_remainingTime: number): string {
    if (_remainingTime <= 0) return 'Token expired';

    const minutes = String(
        Math.floor(_remainingTime / 60000)
    ).padStart(2, '0');
    const seconds = String(
        Math.floor((_remainingTime % 60000) / 1000)
    ).padStart(2, '0');

    return `${minutes} : ${seconds}`;
}