import type { Upgrade } from '@/types'
import Decimal from 'break_infinity.js'

export const upgradesList: Upgrade[] = [
  {
    id: 'auto_type_1',
    name: 'Auto-Typer Basic',
    description: 'Automatically types one character every {effect} seconds',
    baseCost: new Decimal(100),
    level: 0,
    effect: new Decimal(2), // Seconds per character
    unlockCost: new Decimal(50),
    type: 'automation',
  },
  {
    id: 'score_multi_1',
    name: 'Complaint Amplifier',
    description: 'Increases points gained by {effect}x',
    baseCost: new Decimal(200),
    level: 0,
    effect: new Decimal(1.5),
    unlockCost: new Decimal(100),
    type: 'multiplier',
    requires: 'auto_type_1',
  },
  {
    id: 'auto_type_2',
    name: 'Auto-Typer Advanced',
    description: 'Types one character every {effect} second',
    baseCost: new Decimal(500),
    level: 0,
    effect: new Decimal(1), // Seconds per character
    unlockCost: new Decimal(300),
    type: 'automation',
    requires: 'score_multi_1',
  },
]
