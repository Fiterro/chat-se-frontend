import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "capitalizeFirst"
})
export class CapitalizeFirstPipe implements PipeTransform {

    transform(value: string): string {
        if (value === null) {
            return "Wrong text";
        }
        return value.charAt(0).toUpperCase();
    }

}
