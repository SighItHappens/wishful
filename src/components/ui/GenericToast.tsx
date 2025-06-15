import { useEffect, useRef, ReactNode } from 'react';
import {
  FaInfoCircle,
  FaCheckCircle,
  FaExclamationTriangle,
  FaExclamationCircle,
  FaTimes,
} from 'react-icons/fa';
import { animate } from 'animejs';
import toast, { Toast } from 'react-hot-toast';

type ToastVariant = 'info' | 'success' | 'warning' | 'error';

interface GenericToastProps {
  t: Toast;
  duration: number;
  headerText: string;
  bodyContent?: ReactNode;
  variant?: ToastVariant;
}
const defaultVariant: ToastVariant = 'info';

// TODO: Make this customizable
export default function GenericToast({ t, duration, headerText, bodyContent, variant = defaultVariant }: GenericToastProps) {
  const durationBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (t.visible && durationBarRef.current) {
      animate(durationBarRef.current, {
        width: ['100%', '0%'],
        ease: 'linear',
        duration: duration,
      });
    }
  }, [t.visible, duration]);

  const variantStyles = {
    info: {
      IconComponent: FaInfoCircle,
      backgroundColor: 'bg-slate-800',
      borderColor: 'border-indigo-500',
      iconColor: 'text-indigo-400',
      buttonColor: 'text-indigo-400',
      buttonHoverColor: 'hover:text-indigo-300',
      buttonFocusRing: 'focus:ring-indigo-500',
      durationBarColor: 'bg-indigo-500',
    },
    success: {
      IconComponent: FaCheckCircle,
      backgroundColor: 'bg-emerald-900',
      borderColor: 'border-green-500',
      iconColor: 'text-green-400',
      buttonColor: 'text-green-400',
      buttonHoverColor: 'hover:text-green-300',
      buttonFocusRing: 'focus:ring-green-500',
      durationBarColor: 'bg-green-500',
    },
    warning: {
      IconComponent: FaExclamationTriangle,
      backgroundColor: 'bg-amber-900',
      borderColor: 'border-amber-500',
      iconColor: 'text-amber-400',
      buttonColor: 'text-amber-400',
      buttonHoverColor: 'hover:text-amber-300',
      buttonFocusRing: 'focus:ring-amber-500',
      durationBarColor: 'bg-amber-500',
    },
    error: {
      IconComponent: FaExclamationCircle,
      backgroundColor: 'bg-red-900',
      borderColor: 'border-red-500',
      iconColor: 'text-red-400',
      buttonColor: 'text-red-400',
      buttonHoverColor: 'hover:text-red-300',
      buttonFocusRing: 'focus:ring-red-500',
      durationBarColor: 'bg-red-500',
    },
  };

  const currentStyle = variantStyles[variant] || variantStyles.info;
  const Icon = currentStyle.IconComponent;

  return (
    <div
      className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
      } max-w-md w-full ${currentStyle.backgroundColor} opacity-90 shadow-lg rounded-md pointer-events-auto flex flex-col ring-1 ring-gray-700 overflow-hidden`}
    
    >
      <div className={`flex w-full border-l-4 ${currentStyle.borderColor}`}>
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <Icon className={`h-5 w-5 ${currentStyle.iconColor}`} aria-hidden="true" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-semibold text-gray-100">{headerText}</p>
              <div className="mt-1 text-sm text-gray-300">{bodyContent}</div>
            </div>
          </div>
        </div>
        <div className="flex">
          <button onClick={() => toast.dismiss(t.id)} className={`w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium ${currentStyle.buttonColor} ${currentStyle.buttonHoverColor} focus:outline-none focus:ring-2 ${currentStyle.buttonFocusRing}`}>
            <FaTimes className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div>
        <div ref={durationBarRef} className={`h-1 ${currentStyle.durationBarColor} w-full`}></div>  
      </div>
    </div>
  );
}
