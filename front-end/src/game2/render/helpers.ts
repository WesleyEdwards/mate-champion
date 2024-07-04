
export type RenderFun<T> = (obj: T, cxt: CanvasRenderingContext2D) => void;
export type RenderFunH<T> = (obj: T) => (cxt: CanvasRenderingContext2D) => void;
