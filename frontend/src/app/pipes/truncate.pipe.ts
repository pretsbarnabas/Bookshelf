import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

    transform(value: string, maxLength: number = 8): string | null {
        if (!value)
            return value;
        return value.length > maxLength ? value.slice(0, maxLength) + '...' : value;
    }

}
