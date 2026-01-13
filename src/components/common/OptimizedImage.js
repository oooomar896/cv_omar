import React, { useState } from 'react';
import Skeleton from './Skeleton';
import { twMerge } from 'tailwind-merge';

const OptimizedImage = ({
    src,
    alt,
    className,
    width,
    height,
    priority = false,
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
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-gray-500 text-xs text-center p-2">
                    فشل تحميل الصورة
                </div>
            )}
        </div>
    );
};

export default OptimizedImage;
