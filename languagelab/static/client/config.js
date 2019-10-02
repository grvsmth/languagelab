const config = {
    "dateTimeFormat": "MMM D, YYYY h:mm a",
    "tagSplitRE": /[,;]+/,
    "api": {
        "baseUrl": "https://languagelab-dev.grieve-smith.com/api/0.2",
        "endpoint": {
            "Media": "media",
            "Exercises": "exercises",
            "Lessons": "lessons",
            "Queue": "queueItems",
            "Languages": "languages"
        }
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
    }
};

export default config;