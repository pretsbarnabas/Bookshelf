export function formatRemainingTime(_remainingTime: number, lang: string): string {
    if (_remainingTime <= 0) return 'Token expired';

    const days = Math.floor(_remainingTime / (1000 * 60 * 60 * 24));
    const hours = String(Math.floor((_remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
    const minutes = String(Math.floor((_remainingTime % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
    console.log(days)

    return days >= 1 ? `${days} ${lang === 'en' ? (days === 1 ? 'day' : 'days') : 'nap'}` : `${hours} : ${minutes}`;
}