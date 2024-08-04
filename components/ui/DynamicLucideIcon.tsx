// This component is added to to support dynamic icon import for lucide-react
// If we use dynamicIconImports then it imports all icons( approx 2 mb import size ) which makes compiling and build slower for now add icons in map from here
// https://lucide.dev/icons/

// import dynamic from 'next/dynamic'
import {
  AlertTriangle,
  CircleCheck,
  CircleX,
  Download,
  Eye,
  EyeOff,
  Info,
  LucideProps,
  NotebookPen,
  Pencil,
  PencilLine,
  PenSquare,
  Save,
  SaveAll,
  Trash2,
  X
} from 'lucide-react';
// import dynamicIconImports from 'lucide-react/dynamicIconImports';

// interface IconProps extends LucideProps {
//   name: keyof typeof dynamicIconImports;
// }

const IconsMap = {
  'info': Info,
  'circle-x': CircleX,
  'triangle-alert': AlertTriangle,
  'save-all': SaveAll,
  'save': Save,
  'download': Download,
  'circle-check': CircleCheck,
  'trash-2': Trash2,
  'eye': Eye,
  'eye-off': EyeOff,
  'square-pen': PenSquare,
  'notebook-pen': NotebookPen,
  'pencil-line': PencilLine,
  'pencil': Pencil,
  'x': X
}


interface IconProps extends LucideProps {
  name: keyof typeof IconsMap | string;
}

const DynamicLucideIcon = ({ name, ...props }: IconProps) => {

  // const LucideIcon = dynamic(IconsMap[name])
  const LucideIcon = IconsMap[name];
  return <LucideIcon {...props} />;
};

export default DynamicLucideIcon;