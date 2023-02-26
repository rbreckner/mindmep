import {Injectable} from "@angular/core";
import {MepElement, MepElementId} from "./mep/types/mep-element";

@Injectable({
  providedIn: 'root'
})
export class MepService {
  editableElementId: MepElementId | null = null;
}
