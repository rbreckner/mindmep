import {MepConnection, MepConnectionId} from "./mep-connection";
import {MepElement} from "./mep-element";
import chroma from "chroma-js";

export interface HorizontalConnection {
  x: number;
  y: number;
  width: number;
  gradient?: string;
  arrowLeft?: boolean;
  arrowRight?: boolean;
  arrowColor?: string;
}

export interface VerticalConnection {
  x: number;
  y: number;
  height: number;
  gradient?: string;
  arrowUp?: boolean;
  arrowDown?: boolean;
  arrowColor?: string;
}

export interface MepConnectionViewModel {
  connectionId: MepConnectionId;
  firstLine: 'horizontal' | 'vertical';
  horizontal: HorizontalConnection;
  vertical: VerticalConnection;
}

export interface CreateConnectionElement {
  el: MepElement;
  rect: DOMRect;
}

export const createConnectionViewModels = (
  elements: { [id: string]: CreateConnectionElement },
  connections: MepConnection[]
) => {
  const mappedConnections: MepConnectionViewModel[] = []

  connections?.forEach(c => {
    const startNode = elements[c.startNodeId.toString()];
    const endNode = elements[c.endNodeId.toString()];


    if (startNode && endNode) {
      let leftNode: CreateConnectionElement;
      let rightNode: CreateConnectionElement;
      let topNode: CreateConnectionElement;
      let bottomNode: CreateConnectionElement;

      if (startNode.rect.left <= endNode.rect.left) {
        leftNode = startNode;
        rightNode = endNode;
      } else {
        leftNode = endNode;
        rightNode = startNode;
      }

      if (startNode.rect.top <= endNode.rect.top) {
        topNode = startNode;
        bottomNode = endNode;
      } else {
        topNode = endNode;
        bottomNode = startNode;
      }

      const offset = 10;

      let xConnection: HorizontalConnection, yConnection: VerticalConnection;


      if (c.firstLine === 'horizontal' || c.firstLine === undefined) {
        xConnection = {
          x: leftNode.rect.right,
          y: leftNode.rect.top + leftNode.rect.height / 2,
          width: (rightNode.rect.left + rightNode.rect.width / 2) - leftNode.rect.right
        };
        yConnection = {
          x: xConnection.x + xConnection.width,
          y: xConnection.y,
          height: bottomNode.rect.top - (topNode.rect.top + topNode.rect.height / 2)
        };



        // gradient logic
        const totalLength = xConnection.width + yConnection.height;
        const xPercentage = xConnection.width / totalLength;
        const gradient = chroma.scale([leftNode.el.color, rightNode.el.color]);
        const jointColor = gradient(xPercentage).hex();
        let yDirection = 'to bottom';

        if (leftNode.el.id === bottomNode.el.id) {
          yConnection.y = topNode.rect.bottom
          yDirection = 'to top';
        }

        xConnection.gradient = `linear-gradient(to right, ${leftNode.el.color} 10%, ${jointColor})`
        yConnection.gradient = `linear-gradient(${yDirection}, ${jointColor}, ${rightNode.el.color} 90%)`

        if (rightNode.el.id === endNode.el.id) {
          if (topNode.el.id === endNode.el.id) {
            yConnection.arrowUp = true;
            yConnection.arrowColor = endNode.el.color;
          } else {
            yConnection.arrowDown = true;
            yConnection.arrowColor = endNode.el.color;
          }
        } else {
          xConnection.arrowLeft = true;
          xConnection.arrowColor = endNode.el.color;
        }

      } else {
        yConnection = {
          x: leftNode.rect.left + leftNode.rect.width / 2,
          y: leftNode.rect.bottom,
          height: (rightNode.rect.top + rightNode.rect.height / 2) - leftNode.rect.bottom,
        };
        xConnection = {
          x: yConnection.x,
          y: yConnection.y + yConnection.height,
          width: rightNode.rect.left - yConnection.x,
        };

        const totalLength = xConnection.width + yConnection.height;
        const yPercentage = yConnection.height / totalLength;
        const gradient = chroma.scale([topNode.el.color, bottomNode.el.color]);
        let jointColor = gradient(yPercentage).hex();
        let xDirection = 'to right';

        yConnection.gradient = `linear-gradient(to bottom, ${topNode.el.color} 10%, ${jointColor})`
        xConnection.gradient = `linear-gradient(to right, ${jointColor}, ${bottomNode.el.color} 90%)`


        if (leftNode.el.id === bottomNode.el.id) {
          yConnection = {
            x: leftNode.rect.left + leftNode.rect.width / 2,
            y: rightNode.rect.top + rightNode.rect.height / 2,
            height: leftNode.rect.top - (rightNode.rect.bottom - rightNode.rect.height / 2),
          };
          xConnection = {
            x: yConnection.x,
            y: yConnection.y,
            width: rightNode.rect.left - yConnection.x,
          };

          yConnection.gradient = `linear-gradient(to top, ${bottomNode.el.color} 10%, ${jointColor})`
          xConnection.gradient = `linear-gradient(to right, ${jointColor}, ${topNode.el.color} 90%)`
        }

        if (leftNode.el.id === endNode.el.id) {
          if (topNode.el.id === endNode.el.id) {
            yConnection.arrowUp = true;
            yConnection.arrowColor = endNode.el.color;
          } else {
            yConnection.arrowDown = true;
            yConnection.arrowColor = endNode.el.color;
          }
        } else {
          xConnection.arrowRight = true;
          xConnection.arrowColor = endNode.el.color;
        }

      }

      mappedConnections.push({
        connectionId: c.id,
        firstLine: c.firstLine,
        horizontal: xConnection,
        vertical: yConnection
      });
    }

  })

  return mappedConnections;
}
