import { Cell, CellWithId, Column, Selection, SelectionWithId } from '../types';
export declare const getCell: (value: any, colMax: number, rowMax: number, columns: Column<any, any>[]) => Cell | null;
export declare const getCellWithId: (cell: Cell | null, columns: Column<any, any>[]) => CellWithId;
export declare const getSelection: (value: any, colMax: number, rowMax: number, columns: Column<any, any>[]) => Selection | null;
export declare const getSelectionWithId: (selection: Selection | null, columns: Column<any, any>[]) => SelectionWithId | null;
//# sourceMappingURL=typeCheck.d.ts.map