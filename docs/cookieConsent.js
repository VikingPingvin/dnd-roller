// Cookie consent handling
function showCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    const consent = localStorage.getItem('ga-consent');

    if (!consent) {
        banner.classList.remove('hidden');
    } else if (consent === 'accepted') {
        loadGoogleAnalytics();
    }
}

function acceptCookies() {
    localStorage.setItem('ga-consent', 'accepted');
    document.getElementById('cookie-banner').classList.add('hidden');
    loadGoogleAnalytics();
}

function declineCookies() {
    localStorage.setItem('ga-consent', 'declined');
    document.getElementById('cookie-banner').classList.add('hidden');
}

function loadGoogleAnalytics() {
    // Only load GA if consent given
    if (localStorage.getItem('ga-consent') === 'accepted') {
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=G-PXPLRH9SYV';
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', 'G-PXPLRH9SYV', { 'anonymize_ip': true });
        window.gtag = gtag;
    }
}

// Show banner on page load
document.addEventListener('DOMContentLoaded', showCookieBanner);