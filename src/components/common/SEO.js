import { useEffect } from 'react';

const SEO = ({ title, description, keywords, image }) => {
    useEffect(() => {
        // Update Title
        document.title = title ? `${title} | عمر حميد العديني` : 'عمر حميد العديني - باني مشاريع ذكي';

        // Helper to update meta tags
        const updateMeta = (name, content) => {
            if (!content) return;
            let element = document.querySelector(`meta[name="${name}"]`);
            if (!element) {
                element = document.createElement('meta');
                element.setAttribute('name', name);
                document.head.appendChild(element);
            }
            element.setAttribute('content', content);
        };

        const updateOgMeta = (property, content) => {
            if (!content) return;
            let element = document.querySelector(`meta[property="${property}"]`);
            if (!element) {
                element = document.createElement('meta');
                element.setAttribute('property', property);
                document.head.appendChild(element);
            }
            element.setAttribute('content', content);
        }

        // Update Meta Tags
        updateMeta('description', description);
        updateMeta('keywords', keywords);

        // Update Open Graph
        updateOgMeta('og:title', title);
        updateOgMeta('og:description', description);
        if (image) updateOgMeta('og:image', image);

        // Update Twitter
        updateOgMeta('twitter:title', title);
        updateOgMeta('twitter:description', description);
        if (image) updateOgMeta('twitter:image', image);

    }, [title, description, keywords, image]);

    return null;
};

export default SEO;
