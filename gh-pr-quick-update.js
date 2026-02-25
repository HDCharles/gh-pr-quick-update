// ==UserScript==
// @name         GitHub PR Update Button Next to Approve
// @namespace    https://github.com/HDCharles/gh-pr-quick-update
// @version      1.3
// @description  Add an Update & Approve button when branch is out of date
// @author       HDCharles
// @homepageURL  https://github.com/HDCharles/gh-pr-quick-update
// @supportURL   https://github.com/HDCharles/gh-pr-quick-update/issues
// @match        https://github.com/*/*/pull/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const BUTTON_ID = 'quick-update-approve-btn';

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

    function addUpdateApproveButton() {
        // Don't add if already exists
        if (document.getElementById(BUTTON_ID)) return;

        const updateBtn = findButton('Update branch');
        const approveBtn = findButton('Approve workflows to run');

        // Only add if BOTH buttons exist (branch is out of date AND needs approval)
        if (!updateBtn || !approveBtn) return;

        const approveWrapper = approveBtn.closest('[data-loading-wrapper="true"]');
        if (!approveWrapper) return;

        // Hide the original approve button
        approveWrapper.style.display = 'none';

        // Create the combined button
        const comboBtn = document.createElement('button');
        comboBtn.id = BUTTON_ID;
        comboBtn.type = 'button';
        comboBtn.className = 'prc-Button-ButtonBase-9n-Xk';
        comboBtn.setAttribute('data-loading', 'false');
        comboBtn.setAttribute('data-size', 'medium');
        comboBtn.setAttribute('data-variant', 'default');
        comboBtn.innerHTML = `
            <span data-component="buttonContent" data-align="center" class="prc-Button-ButtonContent-Iohp5">
                <span data-component="text" class="prc-Button-Label-FWkx3">Update & Approve workflows to run</span>
            </span>
        `;

        comboBtn.addEventListener('click', () => {
            const label = comboBtn.querySelector('.prc-Button-Label-FWkx3');
            label.textContent = 'Updating...';

            const currentUpdateBtn = findButton('Update branch');
            if (currentUpdateBtn) {
                currentUpdateBtn.click();
            }

            setTimeout(() => {
                label.textContent = 'Approving...';
                const currentApproveBtn = findButton('Approve workflows to run');
                if (currentApproveBtn) {
                    currentApproveBtn.click();
                }
            }, 1500);
        });

        // Insert where the approve button was
        approveWrapper.parentNode.insertBefore(comboBtn, approveWrapper);
    }

    const observer = new MutationObserver(addUpdateApproveButton);
    observer.observe(document.body, { childList: true, subtree: true });
    addUpdateApproveButton();
})();
