export type Tick = {
  bid: number;
  ask: number;
  spread: number;
};

export type RateInfo = {
  open: number;
  high: number;
  low: number;
  close: number;
  spread: number;
  count: number;
  timestamp: number;
};

export type Position = { x: number; y: number };

type Rectangle = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export type ATParam = {
  bidPos: Position;
  askPos: Position;
  shortRect: Rectangle;
  longRect: Rectangle;
};

export type TCMItem = {
  rect: Rectangle;
  ref: React.RefObject<HTMLDivElement>;
};
