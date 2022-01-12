import type { DrawingOption } from "@svg-drawing/core";
import { SvgDrawing, svgObjectToElement } from "@svg-drawing/core";

export class DrawingBoardManager {
  boards: Record<string, DrawingBoard | undefined>;

  constructor() {
    this.boards = {};
  }

  add(id: string, opts: DrawingOption): DrawingBoard {
    let board = this.get(id);

    if (board) {
      return board;
    }

    return (this.boards[id] = this._createBoard(id, opts));
  }

  remove(id: string): void {
    this.boards[id]?.clear();

    delete this.boards[id];
  }

  get(id: string) {
    return this.boards[id];
  }

  _createBoard(id: string, opts: DrawingOption) {
    let el = document.querySelector(`#annotation-overlay > .boards > div[data-board-id="${id}"]`) as HTMLDivElement;

    if (!el) {
      throw new Error(`Missing drawing board element for: ${id}`);
    }

    return new DrawingBoard(id, opts, el);
  }
}

export class DrawingBoard {
  id: string;
  _drawing: SvgDrawing;

  constructor(id: string, opts: DrawingOption, element: HTMLElement) {
    this.id = id;

    this._drawing = new SvgDrawing(element, {
      delay: 60, // Set how many ms to draw points every.
      ...opts,
    });
  }

  clean() {
    this._drawing.svg.paths = this._drawing.svg.paths.filter(path => path.commands.length > 0);
    this._drawing.update();
  }

  isEmpty() {
    return !this._drawing.svg.paths.length;
  }

  getSvgJson() {
    return this._drawing.svg.toJson();
  }

  getSvgXML() {
    return svgObjectToElement(this._drawing.svg.toJson()).outerHTML;
  }

  changePenColor(param: DrawingOption["penColor"]) {
    if (!param) return;
    this._drawing.penColor = param;
  }

  changeFill(param: DrawingOption["fill"]) {
    if (!param) return;
    this._drawing.fill = param;
  }

  changeDelay(param: DrawingOption["delay"]) {
    if (!param) return;
    this._drawing.changeDelay(param);
  }

  changePenWidth(param: DrawingOption["penWidth"]) {
    this._drawing.penWidth = Number(param);
  }

  changeClose(param: DrawingOption["close"]) {
    this._drawing.close = param ?? false;
  }

  changeCurve(param: DrawingOption["curve"]) {
    this._drawing.curve = param ?? true;
  }

  clear() {
    this._drawing.clear();
  }

  undo() {
    this._drawing.undo();
  }
}
