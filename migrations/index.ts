import * as migration_20260804_115531_initial from './20260804_115531_initial';
import * as migration_20260805_102455_add_subscribers from './20260805_102455_add_subscribers';
import * as migration_20260807_095837_add_status_cover_image from './20260807_095837_add_status_cover_image';
import * as migration_20260809_094524_add_media_uploads from './20260809_094524_add_media_uploads';
import * as migration_20261029_063714_add_reset_password_requested_at from './20261029_063714_add_reset_password_requested_at';

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
    name: '20260807_095837_add_status_cover_image',
  },
  {
    up: migration_20260809_094524_add_media_uploads.up,
    down: migration_20260809_094524_add_media_uploads.down,
    name: '20260809_094524_add_media_uploads',
  },
  {
    up: migration_20261029_063714_add_reset_password_requested_at.up,
    down: migration_20261029_063714_add_reset_password_requested_at.down,
    name: '20261029_063714_add_reset_password_requested_at'
  },
];
