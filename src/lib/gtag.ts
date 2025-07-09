export const pageview = (url: string) => {
    window.gtag('config', 'G-XXXXXXX', {
        page_path: url
    });
};
