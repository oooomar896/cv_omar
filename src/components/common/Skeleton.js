
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

const Skeleton = ({ className, ...props }) => {
    return (
        <div
            className={twMerge(
                clsx(
                    "animate-pulse rounded-md bg-gray-700/50",
                    className
                )
            )}
            {...props}
        />
    );
};

export default Skeleton;
