import * as Config from './Config'

type StateOf<TStatefull extends Config.Statefull<object, unknown>> =
  TStatefull['state']

export type { StateOf }
