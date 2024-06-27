/* tslint:disable */
/* eslint-disable */
/**
*/
export enum Cell {
  Empty,
  Person,
  Key,
  Aim,
  Wall,
}
/**
*/
export class Game {
  free(): void;
/**
*/
  tick(): void;
/**
* @returns {Game}
*/
  static new(): Game;
/**
* @returns {number}
*/
  width(): number;
/**
* @returns {number}
*/
  height(): number;
/**
* @returns {number}
*/
  room(): number;
/**
* @returns {boolean}
*/
  game_over(): boolean;
/**
*/
  restart(): void;
/**
* @param {boolean} v
*/
  set_is_log(v: boolean): void;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_game_free: (a: number) => void;
  readonly game_tick: (a: number) => void;
  readonly game_new: () => number;
  readonly game_width: (a: number) => number;
  readonly game_height: (a: number) => number;
  readonly game_room: (a: number) => number;
  readonly game_game_over: (a: number) => number;
  readonly game_restart: (a: number) => void;
  readonly game_set_is_log: (a: number, b: number) => void;
  readonly __wbindgen_free: (a: number, b: number) => void;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
  readonly __wbindgen_exn_store: (a: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
