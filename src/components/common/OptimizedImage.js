import { useState } from 'react';
import Skeleton from './Skeleton';
import { twMerge } from 'tailwind-merge';
import { ImageOff } from 'lucide-react';

const OptimizedImage = ({
    src,
    alt,
    className,
    width,
    height,
    priority = false,
    FallbackIcon = ImageOff, // Default icon if none provided
    ...props
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    return (
        <div className={twMerge("relative overflow-hidden", className)} style={{ width, height }}>
            {(!isLoaded && !hasError) && (
                <Skeleton className="absolute inset-0 w-full h-full" />
            )}

            <img
                src={src}
                alt={alt}
                loading={priority ? 'eager' : 'lazy'}
                onLoad={() => setIsLoaded(true)}
                onError={() => {
                    setIsLoaded(true);
                    setHasError(true);
                }}
                className={twMerge(
                    "duration-500 ease-in-out w-full h-full object-cover transition-opacity",
                    !isLoaded ? "opacity-0" : "opacity-100",
                    className
                )}
                {...props}
            />

            {hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800/80 backdrop-blur-sm border border-white/5">
                    <div className="flex flex-col items-center gap-2 p-4 text-center">
                        <FallbackIcon className="w-8 h-8 text-gray-600" strokeWidth={1.5} />
                        <span className="text-[10px] text-gray-500 font-mono">Image N/A</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OptimizedImage;
