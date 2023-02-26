export const windowDebug = (name: string, ref: object) => {
  (window as any)[name] = ref;
}

export interface Id<T> extends String {
    __idTypeFor?: T;
}
