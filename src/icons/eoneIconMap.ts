/** Tabla de equivalencias de iconos para la migración de eOne (Flow 1.x → 3.0).
 *
 * eOne reparte 68 nombres estilo Feather como strings por 100+ archivos
 * (§4 del inventario). El DS usa Material Symbols Rounded por ligadura
 * (snake_case). Esta tabla es el puente medido; `mapEoneIcon` cae al nombre
 * original si no hay entrada, para que un icono nuevo no pinte «Missing icon»
 * en silencio durante la migración.
 *
 * Los dos nombres inválidos del inventario también resuelven: `navigation`
 * existe en Material Symbols y `x` era `close`.
 */
export const EONE_ICON_MAP: Record<string, string> = {
  activity: 'monitoring',
  'alert-triangle': 'warning',
  archive: 'archive',
  'arrow-left': 'arrow_back',
  'arrow-right': 'arrow_forward',
  'bar-chart': 'bar_chart',
  bell: 'notifications',
  book: 'menu_book',
  bookmark: 'bookmark',
  box: 'inventory_2',
  calendar: 'calendar_today',
  check: 'check',
  'check-circle': 'check_circle',
  'chevron-down': 'expand_more',
  'chevron-left': 'chevron_left',
  'chevron-right': 'chevron_right',
  'chevron-up': 'expand_less',
  clock: 'schedule',
  close: 'close',
  code: 'code',
  compass: 'explore',
  copy: 'content_copy',
  'credit-card': 'credit_card',
  database: 'database',
  'dollar-sign': 'attach_money',
  download: 'download',
  edit: 'edit',
  eye: 'visibility',
  'file-text': 'description',
  filter: 'filter_list',
  flag: 'flag',
  grid: 'grid_view',
  home: 'home',
  inbox: 'inbox',
  layers: 'layers',
  layout: 'dashboard',
  link: 'link',
  loader: 'progress_activity',
  lock: 'lock',
  mail: 'mail',
  'maximize-2': 'open_in_full',
  menu: 'menu',
  minus: 'remove',
  monitor: 'desktop_windows',
  move: 'open_with',
  navigation: 'navigation',
  package: 'package_2',
  pencil: 'stylus',
  plus: 'add',
  'refresh-cw': 'refresh',
  save: 'save',
  search: 'search',
  send: 'send',
  settings: 'settings',
  'share-2': 'share',
  shield: 'shield',
  star: 'star',
  table: 'table',
  tag: 'sell',
  'trash-2': 'delete',
  'trending-down': 'trending_down',
  'trending-up': 'trending_up',
  undo: 'undo',
  upload: 'upload',
  user: 'person',
  users: 'group',
  'wifi-off': 'wifi_off',
  x: 'close',
}

/** Resuelve un nombre de icono de eOne al glifo Material del DS. */
export function mapEoneIcon(name: string): string {
  return EONE_ICON_MAP[name] ?? name
}
