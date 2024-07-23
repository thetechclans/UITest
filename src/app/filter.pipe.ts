import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(items: any[], filter: string): any[] {
    if (!items || items.length === 0 || !filter) {
      return items;
    }

    const filterValue = filter.toLowerCase();

    return items.filter((item) => {
      return this.contains(item, filterValue);
    });
  }

  private contains(item: any, filterValue: string): boolean {
    for (const prop in item) {
      if (item.hasOwnProperty(prop)) {
        if (typeof item[prop] === 'string' && item[prop].toLowerCase().includes(filterValue)) {
          return true;
        } else if (typeof item[prop] === 'object' && this.contains(item[prop], filterValue)) {
          return true;
        }
      }
    }
    return false;
  }

}