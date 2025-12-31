'use client';

import { Download } from 'lucide-react';
import Link from 'next/link';

/**
 * Install App Button
 * 
 * A simple button that links to the /install page.
 * You can add this anywhere in your app (navbar, settings, etc.)
 * 
 * Usage:
 * import InstallButton from '@/components/InstallButton';
 * <InstallButton />
 */

interface InstallButtonProps {
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export default function InstallButton({
    variant = 'primary',
    size = 'md',
    className = ''
}: InstallButtonProps) {
    const baseStyles = 'inline-flex items-center gap-2 font-semibold rounded-xl transition-all hover:scale-105 active:scale-95';

    const variantStyles = {
        primary: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
        outline: 'border-2 border-blue-500 text-blue-500 hover:bg-blue-50'
    };

    const sizeStyles = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg'
    };

    return (
        <Link
            href="/install"
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        >
            <Download className={size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'} />
            Install App
        </Link>
    );
}
