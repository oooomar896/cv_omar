import { useEffect } from 'react';

const SEOStructuredData = () => {
    useEffect(() => {
        const scriptId = 'json-ld-structured-data';

        // Check if exists
        if (document.getElementById(scriptId)) return;

        const personSchema = {
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "عمر حميد العديني",
            "url": "https://cv-omar.netlify.app",
            "jobTitle": "Full Stack Developer",
            "image": "https://cv-omar.netlify.app/my_image.jpg",
            "sameAs": [
                "https://github.com/oooomar896",
                "https://linkedin.com/in/omar-hamid-288385235"
            ],
            "description": "مطور برمجيات شامل (Full Stack) وتخصص في الذكاء الاصطناعي.",
            "knowsAbout": ["Web Development", "Mobile App Development", "Artificial Intelligence", "React", "Node.js"]
        };

        const websiteSchema = {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "محفظة عمر العديني",
            "url": "https://cv-omar.netlify.app",
            "potentialAction": {
                "@type": "SearchAction",
                "target": "https://cv-omar.netlify.app/?q={search_term_string}",
                "query-input": "required name=search_term_string"
            }
        };

        const script = document.createElement('script');
        script.id = scriptId;
        script.type = "application/ld+json";
        script.innerHTML = JSON.stringify([personSchema, websiteSchema]);
        document.head.appendChild(script);

        return () => {
            // Cleanup? Usually structured data stays, but in SPA maybe we want to keep it. 
            // Actually for "Person" and "WebSite" it's global, so maybe just leave it or remove on unmount if it was page specific.
            // For now, let's leave it as it's global data.
            // But to be clean in React useEffect:
            const el = document.getElementById(scriptId);
            if (el) {
                document.head.removeChild(el);
            }
        };
    }, []);

    return null;
};

export default SEOStructuredData;
