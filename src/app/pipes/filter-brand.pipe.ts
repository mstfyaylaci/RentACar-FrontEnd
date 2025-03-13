import { Pipe, PipeTransform } from '@angular/core';
import { Brand } from '../models/entites/brand';

@Pipe({
  name: 'filterBrand',
  standalone: false
})
export class FilterBrandPipe implements PipeTransform {

  transform(value: Brand[], filterText: string): Brand[] {

    filterText=filterText?
              filterText.toLocaleLowerCase()
              :""


    return filterText?
    value.filter((b:Brand)=>b.brandName.toLocaleLowerCase().indexOf(filterText)!==-1)
    :value
    
  }

}
