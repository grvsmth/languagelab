/**
 * Configuration for LanguageLab client
 *
 * Angus B. Grieve-Smith, 2026
 */
const config = {
    "ui": {
        "brandText": "LanguageLab"
    },
    "version": "0.3",
    "api": {
        "baseUrl": "/api/0.2",
        "models": [
            {
                "menu": "Media",
                "endpoint": "media",
                "item": "Media item",
                "nonStaff": false
            },
            {
                "menu": "Exercises",
                "endpoint": "exercises",
                "item": "exercise",
                "nonStaff": true
            },
            {
                "endpoint": "lessons",
                "menu": "Lessons",
                "item": "lesson",
                "nonStaff": true
            },
            {
                "endpoint": "languages",
                "menu": "Languages",
                "item": "language",
                "nonStaff": false
            },
            {
                "endpoint": "users",
                "menu": "Users",
                "item": "user",
                "hideNav": true
            },
            {
                "endpoint": "controls",
                "menu": "Controls",
                "item": "control",
                "local": true,
                "nonStaff": false
            },
            {
                "endpoint": "help",
                "menu": "Help",
                "item": "help",
                "local": true,
                "nonStaff": true
            },
            {
                "endpoint": "config",
                "hideNav": true
            },
            {
                "endpoint": "currentUser",
                "hideNav": true
            }
        ]
    },
    "iso639": {
        "url": "https://iso639-3.sil.org/code_tables/639/data"
    }
};

export default config;