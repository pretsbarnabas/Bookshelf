export abstract class SortItems {
    public static generalizedSort<T>(array: T[], property: string, direction: 'asc' | 'desc'): T[] {
        return array.sort((a, b) => {
            const valA = this.getValue(a, property);
            const valB = this.getValue(b, property);

            if (valA == null && valB == null) {
                return 0;
            }
            if (valA == null) {
                return direction === 'asc' ? -1 : 1;
            }
            if (valB == null) {
                return direction === 'asc' ? 1 : -1;
            }

            const normalizedValA = typeof valA === 'string' ? valA.toLowerCase() : valA;
            const normalizedValB = typeof valB === 'string' ? valB.toLowerCase() : valB;

            if (normalizedValA === normalizedValB) {
                return 0;
            }

            const compareResult = (normalizedValA < normalizedValB ? -1 : 1) * (direction === 'asc' ? 1 : -1);
            return compareResult;
        });
    }


    public static getValue<T>(obj: T, property: string): any {
        return property.split('.').reduce((o, i) => (o as any)[i], obj);
    }

}