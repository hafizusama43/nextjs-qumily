// This component is added to to support dynamic icon import for lucide-react
// If we use dynamicIconImports then it imports all icons( approx 2 mb import size ) which makes compiling and build slower for now add icons in map from here
// https://lucide.dev/icons/

// import dynamic from 'next/dynamic'
import { CircleCheck, CircleX, Download, Info, LucideProps, Save, SaveAll } from 'lucide-react';

// import dynamicIconImports from 'lucide-react/dynamicIconImports';
import { AlertTriangle, CheckCircle2Icon } from 'lucide-react'
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
  'circle-check': CircleCheck
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