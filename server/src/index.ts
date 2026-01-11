#!/usr/bin/env ts-node
import { IS_PRODUCTION, PORT } from './CONSTS/DOTENV'
import { main } from './main'

main({ port: PORT, isProd: IS_PRODUCTION })
