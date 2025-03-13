import { Pipe, PipeTransform } from '@angular/core';
import { Color } from '../models/entites/color';

@Pipe({
  name: 'filterColor',
  standalone: false
})
export class FilterColorPipe implements PipeTransform {

  transform(value: Color[], filterColor: string):  Color[] {

    filterColor=filterColor?
    filterColor.toLocaleLowerCase()
    :""

    return filterColor?
    value.filter((c:Color)=>c.colorName.toLocaleLowerCase().indexOf(filterColor)!==-1)
    :value
  }

}
