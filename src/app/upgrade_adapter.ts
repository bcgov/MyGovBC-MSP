import {UpgradeAdapter} from '@angular/upgrade'

import {AppModule} from './index.module.ts'

export const upgradeAdapter = new UpgradeAdapter(AppModule)
