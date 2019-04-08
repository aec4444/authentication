export interface IGafPromiseFunctions {
  resolve?: (success: boolean) => void;
  reject?: (error: any) => void;
}
