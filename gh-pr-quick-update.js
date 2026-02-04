// ==UserScript==
// @name         GitHub PR Update Button Next to Approve
// @namespace    https://github.com/HDCharles/gh-pr-quick-update
// @version      1.1
// @description  Add a small Update Branch button next to Approve Workflows
// @author       HDCharles
// @homepageURL  https://github.com/HDCharles/gh-pr-quick-update
// @supportURL   https://github.com/HDCharles/gh-pr-quick-update/issues
// @match        https://github.com/*/*/pull/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const BUTTON_ID = 'quick-update-branch-btn';

    function findButton(labelText) {
        const buttons = document.querySelectorAll('button.prc-Button-ButtonBase-9n-Xk');
        for (const btn of buttons) {
            const label = btn.querySelector('.prc-Button-Label-FWkx3');
            if (label && label.textContent.trim() === labelText) {
                return btn;
            }
        }
        return null;
    }

    function addUpdateButton() {
        // Don't add if already exists
        if (document.getElementById(BUTTON_ID)) return;

        const updateBtn = findButton('Update branch');
        const approveBtn = findButton('Approve workflows to run');

        // Only add if both buttons exist
        if (!updateBtn || !approveBtn) return;

        // Find the wrapper div around the approve button
        const approveWrapper = approveBtn.closest('[data-loading-wrapper="true"]');
        if (!approveWrapper) return;

        // Create a small update button
        const quickUpdateBtn = document.createElement('button');
        quickUpdateBtn.id = BUTTON_ID;
        quickUpdateBtn.type = 'button';
        quickUpdateBtn.className = 'prc-Button-ButtonBase-9n-Xk';
        quickUpdateBtn.setAttribute('data-loading', 'false');
        quickUpdateBtn.setAttribute('data-size', 'medium');
        quickUpdateBtn.setAttribute('data-variant', 'default');
        quickUpdateBtn.style.marginRight = '8px';
        quickUpdateBtn.innerHTML = `
            <span data-component="buttonContent" data-align="center" class="prc-Button-ButtonContent-Iohp5">
                <span data-component="text" class="prc-Button-Label-FWkx3">Update</span>
            </span>
        `;

        quickUpdateBtn.addEventListener('click', () => {
            const currentUpdateBtn = findButton('Update branch');
            if (currentUpdateBtn) {
                currentUpdateBtn.click();
            }
        });

        // Insert before the approve button wrapper
        approveWrapper.parentNode.insertBefore(quickUpdateBtn, approveWrapper);
    }

    // Run on load and observe for dynamic content
    const observer = new MutationObserver(addUpdateButton);
    observer.observe(document.body, { childList: true, subtree: true });
    addUpdateButton();
})();
