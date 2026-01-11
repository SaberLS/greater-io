import type { CorsOptions } from 'cors'
import { CLIENT } from '../CONSTS/DOTENV'

const optionsCors: CorsOptions = { origin: CLIENT, credentials: true }

export { optionsCors }
