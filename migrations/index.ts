import * as migration_20260804_115531_initial from './20260804_115531_initial';
import * as migration_20260805_102455_add_subscribers from './20260805_102455_add_subscribers';

export const migrations = [
  {
    up: migration_20260804_115531_initial.up,
    down: migration_20260804_115531_initial.down,
    name: '20260804_115531_initial',
  },
  {
    up: migration_20260805_102455_add_subscribers.up,
    down: migration_20260805_102455_add_subscribers.down,
    name: '20260805_102455_add_subscribers'
  },
];
