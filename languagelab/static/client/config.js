const config = {
    "version": "0.2alpha",
    "api": {
        "baseUrl": "https://languagelab.grieve-smith.com/api/0.2",
        "models": [
            {
                "menu": "Media",
                "endpoint": "media",
                "item": "Media item"
            },
            {
                "menu": "Exercises",
                "endpoint": "exercises",
                "item": "exercise"
            },
            {
                "endpoint": "lessons",
                "menu": "Lessons",
                "item": "lesson"
            },
            {
                "endpoint": "languages",
                "menu": "Languages",
                "item": "language"
            },
            {
                "endpoint": "users",
                "menu": "Users",
                "item": "user",
                "hideNav": true,
            },
            {
                "endpoint": "controls",
                "menu": "Controls",
                "item": "control",
                "local": true
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