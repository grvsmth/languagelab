/**
 * Configuration for LanguageLab client
 *
 * Angus B. Grieve-Smith, 2021
 */
const config = {
    "version": "0.2beta",
    "api": {
        "baseUrl": "https://languagelab.grieve-smith.com/api/0.2",
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
    "doButton": {
        "previous": {
            "icon": "oi-caret-left",
            "color": "info"
        },
        "next": {
            "icon": "oi-caret-right",
            "color": "info"
        }
    },
    "iso639": {
        "url": "https://iso639-3.sil.org/code_tables/639/data"
    }
};

export default config;