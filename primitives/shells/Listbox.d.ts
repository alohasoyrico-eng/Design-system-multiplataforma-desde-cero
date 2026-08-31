/** Maquina de lista seleccionable. Generado desde contracts/listbox.json. */
export interface ListboxItem { value: string; label: string; group?: string; hint?: string; disabled?: boolean; }
export interface ListboxHandle { readonly activeItem?: ListboxItem; readonly count: number; onKeyDown(e: React.KeyboardEvent): boolean; }
export interface ListboxProps {
  idPrefix?: string;
  items: Array<string | ListboxItem>;
  value?: string | string[];
  onSelect: (value: string | string[]) => void;
  multiple?: boolean;
  /** Filtrado controlado: una sola implementacion del includes() en todo el sistema. */
  query?: string;
  groupOrder?: string[];
  renderItem?: (item: ListboxItem, state: { active: boolean; selected: boolean }) => React.ReactNode;
  emptyLabel?: string;
  onActiveIdChange?: (id?: string) => void;
  maxHeight?: number;
  extraRow?: React.ReactNode;
}
export declare const Listbox: React.ForwardRefExoticComponent<ListboxProps & React.RefAttributes<ListboxHandle>>;
