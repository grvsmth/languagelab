/**
 * Configuration and documentation for links to control pages
 *
 * Angus B. Grieve-Smith, 2021
 */
const exports = [
    {
        "name": "admin",
        "title": "User administration",
        "description": "Create, delete and configure users",
        "target": "_blank",
        "url": "/admin/"
    },
    {
        "name": "export",
        "description": "Export language lab data to a JSON file",
        "endpoint": "all",
        "mimeType": "application/json",
        "title": "Export data"
    }
];

export default exports;