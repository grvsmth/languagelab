const config = {
    "dateTimeFormat": "MMM D, YYYY h:mm a",
    "timeFormat": "HH:mm:ss.S",
    "tagSplitRE": /\s*[,;]+\s*/,
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
                "item": "user"
            }
        ]
    },
    "formatName": {
        "au": "audio",
        "vi": "video"
    },
    "audio": {
        "options": {
            "audioBitsPerSecond": 128000,
            "sampleRate": 48000
        }
    },
    "queueButton": {
        "up": {
            "icon": "oi-caret-top",
            "color": "success"
        },
        "down": {
            "icon": "oi-caret-bottom",
            "color": "success"
        },
        "remove": {
            "icon": "oi-circle-x",
            "color": "danger"
        }
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
    "navUrl": {
        "users": "/admin/"
    },
    "message": {
        "lessonQueue": "If you add lessons, you can add this exercise to a lesson"
    },
    "hideIsAvailablePublic": true
};

export default config;