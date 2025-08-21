// ==UserScript==
// @name        Enable Wplace.live Reporting
// @namespace   https://github.com/yeeterlol
// @match       https://wplace.live/*
// @grant
// @version     1.0.0
// @author      yeeterlol
// @description A userscript to enable the reporting feature on wplace.live
// @run-at document-body
// ==/UserScript==


function inject(callback) {
    const script = document.createElement('script');
    script.setAttribute('bm-name', name); // Passes in the name value
    script.setAttribute('bm-cStyle', consoleStyle); // Passes in the console style value
    script.textContent = `(${callback})();`;
    document.documentElement?.appendChild(script);
    script.remove();
}

inject(() => {
  const originalFetch = window.fetch; // Saves a copy of the original fetch
  window.fetch = async function(...args) {
    const response = await originalFetch.apply(this, args);
    const cloned = response.clone();
    const endpointName = ((args[0] instanceof Request) ? args[0]?.url : args[0]) || 'ignore';

    // Check Content-Type to only process JSON
    const contentType = cloned.headers.get('content-type') || '';
    if (contentType.includes('application/json') && endpointName === "https://backend.wplace.live/me" ) {
      const jsonData = await response.clone().json();
      const newBody = JSON.stringify({
        ...jsonData,
        id: 999999
      });

      const modifiedResponse = new Response(newBody, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      });

      return modifiedResponse;
    }
    return response;
  };
});