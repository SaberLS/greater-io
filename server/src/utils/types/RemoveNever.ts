type RemoveNever<T extends object> = {
  [K in keyof T as T[K] extends never ? never : K]: T[K]
}

export type { RemoveNever }
