import getBaseUrl from './baseURL';

function getImgUrl(name) {
    if (!name) return '';
    // If it's already an absolute URL (e.g., Cloudinary), return as-is
    if (typeof name === 'string') {
        if (/^(https?:)?\/\//.test(name)) return name;
        // Support backend-hosted paths; prefix with API base URL
        const base = getBaseUrl();
        if (name.startsWith('/')) return `${base}${name}`;
        if (name.startsWith('uploads/')) return `${base}/${name}`;
        if (name.startsWith('images/')) return `${base}/${name}`;
    }
    try {
        const url = new URL(`../assets/books/${name}`, import.meta.url);
        return url.href;
    } catch (_) {
        return '';
    }
}

export { getImgUrl }