import { Pipe, PipeTransform } from '@angular/core';
import { Car } from '../models/entites/car';

@Pipe({
  name: 'filterCar',
  standalone: false
})
export class FilterCarPipe implements PipeTransform {

  transform(value: Car[], filterText:string): Car[] {
    filterText = filterText?filterText.toLocaleLowerCase():"";
    return filterText?value.filter((c:Car)=>c.carName.toLocaleLowerCase().indexOf(filterText)!==-1):value
  }

}
