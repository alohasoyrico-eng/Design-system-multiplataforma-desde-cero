export interface UploadedFile { name: string; size?: number; }
/** Drag-and-drop file zone with removable file list. Controlled via files/onChange. */
export interface FileUploadProps {
  files?: UploadedFile[];
  onChange?: (files: UploadedFile[]) => void;
  label?: string;
  hint?: string;
  /** e.g. ".pdf,image/*" */
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
}
export declare function FileUpload(props: FileUploadProps): JSX.Element;
