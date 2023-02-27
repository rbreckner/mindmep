import {MepElementId} from "./mep-element";
import {Id} from "../../../shared/helper";

export type MepConnectionId = Id<MepConnection>;

export interface MepConnection {
  id: MepConnectionId;
  firstLine: 'horizontal' | 'vertical';
  startNodeId: MepElementId;
  endNodeId: MepElementId;
}
