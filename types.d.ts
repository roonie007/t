export type StringWithAutocomplete<T> = T | (Record<never, never> & string);

// Taken from https://twitter.com/diegohaz/status/1309489079378219009
type PathImpl<T, Key extends keyof T> = Key extends string ? T[Key] extends Record<string, unknown> ? 
      | `${Key}.${
        & PathImpl<T[Key], Exclude<keyof T[Key], keyof unknown[]>>
        & string}`
      | `${Key}.${Exclude<keyof T[Key], keyof unknown[]> & string}`
  : never
  : never;

type PathImpl2<T> = PathImpl<T, keyof T> | keyof T;

type Path<T> = PathImpl2<T> extends string | keyof T ? PathImpl2<T> : keyof T;

export interface Translation<T> {
  get<K extends Path<T>>(
    locale: string,
    key: StringWithAutocomplete<K>,
    args?: Record<string, unknown>,
  ): string | null;
}
