const config = {
    "dateTimeFormat": "MMM D, YYYY h:mm a",
    "tagSplitRE": /[,;]+/,
    "api": {
        "baseUrl": "https://languagelab-dev.grieve-smith.com/api/0.2",
        "endpoint": {
            "mediaLink": "media",
            "exercisesLink": "exercises",
            "languagesLink": "languages",
            "lessonsLink": "lessons",
            "queueLink": "queueItems"
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