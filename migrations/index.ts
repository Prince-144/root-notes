import * as migration_20260804_115531_initial from './20260804_115531_initial';
import * as migration_20260805_102455_add_subscribers from './20260805_102455_add_subscribers';
import * as migration_20260807_095837_add_status_cover_image from './20260807_095837_add_status_cover_image';

export const migrations = [
  {
    up: migration_20260804_115531_initial.up,
    down: migration_20260804_115531_initial.down,
    name: '20260804_115531_initial',
  },
  {
    up: migration_20260805_102455_add_subscribers.up,
    down: migration_20260805_102455_add_subscribers.down,
    name: '20260805_102455_add_subscribers',
  },
  {
    up: migration_20260807_095837_add_status_cover_image.up,
    down: migration_20260807_095837_add_status_cover_image.down,
    name: '20260807_095837_add_status_cover_image'
  },
];
