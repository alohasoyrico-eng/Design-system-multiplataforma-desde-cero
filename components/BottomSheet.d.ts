/** Mobile bottom sheet with grab handle; springs up over a scrim. fixed=false positions absolute (phone frames). */
export interface BottomSheetProps {
  open?: boolean;
  onClose?: () => void;
  title?: string;
  children?: React.ReactNode;
  height?: string | number;
  fixed?: boolean;
  style?: React.CSSProperties;
}
export declare function BottomSheet(props: BottomSheetProps): JSX.Element;
