(function() {
    'use strict';

    // Add CSS for the popup
    const style = document.createElement('style');
    style.textContent = `
        .course-popup {
            position: absolute;
            border: 1px solid #ccc;
            border-radius: 3px;
            background: #fff;
            padding: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            z-index: 1000;
            display: none;
            max-width: 580px;
        }
    `;
    document.head.appendChild(style);

    // Create the popup element
    const popup = document.createElement('div');
    popup.className = 'course-popup';
    document.body.appendChild(popup);

    // Function to show the popup
    function showPopup(event, content) {
        popup.innerHTML = content;
        popup.style.top = `${event.pageY + 10}px`;
        popup.style.left = `${event.pageX + 10}px`;
        popup.style.display = 'block';
    }

    // Function to hide the popup
    function hidePopup() {
        popup.style.display = 'none';
    }

    // Function to extract course details
    function extractCourseDetails(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Data to extract
        const title = doc.querySelector('h1.page-title')?.innerText || 'N/A';
        const hours = doc.querySelector('div.field--name-field-hours .field__item')?.innerText || 'N/A';
        const descriptionElements = doc.querySelectorAll('div.node__content div.field--name-body.field--type-text-with-summary p');
        const description = Array.from(descriptionElements).map(p => p.innerText).join('<br><br>') || 'N/A';
        const prerequisites = doc.querySelector('div.field--name-field-prerequisite .field__item')?.innerText || 'N/A';
        const corequisites = doc.querySelector('div.field--name-field-corequisite .field__item')?.innerText || 'N/A';
        const requirement = doc.querySelector('div.field--name-field-breadth-requirements .field__item')?.innerText || 'N/A';

        // Displayed content
        return `
            <strong>Title:</strong> ${title}<br>
            <strong>Hours:</strong> ${hours}<br>
            <strong>Description:</strong> ${description}<br>
            <strong>Prerequisites:</strong> ${prerequisites}<br>
            <strong>Corequisites:</strong> ${corequisites}<br>
            <strong>Requirement (Breadth):</strong> ${requirement}
        `;
    }

    // Add event listeners to course links
    document.querySelectorAll('a[href^="/course/"]').forEach(link => {
        link.addEventListener('mouseover', event => {
            const url = link.getAttribute('href').toLowerCase();
            fetch(url)
                .then(response => response.text())
                .then(html => {
                    const details = extractCourseDetails(html);
                    showPopup(event, details);
                });
        });

        link.addEventListener('mouseout', hidePopup);
    });
})();
