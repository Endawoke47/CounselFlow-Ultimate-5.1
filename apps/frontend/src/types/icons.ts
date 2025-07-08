import { LucideIcon, LucideProps } from 'lucide-react';

// Our custom icon props
export interface IconProps {
  size?: number | string;
  className?: string;
  color?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
}

// Custom icon component type
export type CustomIconComponent = React.ComponentType<IconProps>;

// Universal icon type that accepts both Lucide icons and our custom icons
export type UniversalIcon = LucideIcon | CustomIconComponent;

// Helper type to make props compatible
export type IconCompatibleProps = {
  size?: number | string;
  className?: string;
  [key: string]: any;
};