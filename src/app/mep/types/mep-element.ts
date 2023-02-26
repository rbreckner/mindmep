import {Id} from "../../../helper";

export type MepElementId = Id<MepElementId>;

export interface MepElement {
  id: MepElementId;
  text: string;
  x: number;
  y: number;
  color: string;
}
