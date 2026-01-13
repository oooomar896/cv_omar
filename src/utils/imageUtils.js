/**
 * Converts a Google Drive shareable link to a direct download/view link.
 * @param {string} link - The Google Drive link.
 * @returns {string} - The direct link or the original link if not a Google Drive link.
 */
export const convertGoogleDriveLink = (url) => {
    if (!url) return '';
    try {
        if (url.includes('drive.google.com') || url.includes('share.google')) {
            let id = '';
            const match1 = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
            const match2 = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
            const match3 = url.match(/share\.google\/([a-zA-Z0-9_-]+)/);

            if (match1) id = match1[1];
            else if (match2) id = match2[1];
            else if (match3) id = match3[1];

            if (id) {
                return `https://drive.google.com/uc?export=view&id=${id}`;
            }
        }
    } catch (e) {
        console.error('Error converting Google Drive link:', e);
    }
    return url;
};
