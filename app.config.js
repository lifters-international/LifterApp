export default {
  "expo": {
    "name": "LiftersHome",
    "slug": "LiftersHome",
    "version": "4.0.3",
    "orientation": "portrait",
    "icon": "./assets/icons/Icons/lifters-icon-google-play.png",
    "userInterfaceStyle": "dark",
    "splash": {
      "image": "./assets/icons/Icons/lifters-icon-google-play.png",
      "resizeMode": "cover",
      "backgroundColor": "#000000"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.lifters.international.lifters",
      "buildNumber": "15.0.0"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/icons/Icons/lifters-icon-google-play.png",
        "backgroundColor": "#000000"
      },
      "package": "com.lifters.international.lifter",
      "versionCode": 15,
      "permissions": [
        "android.permission.RECORD_AUDIO"
      ],
      "googleServicesFile": process.env.google_services_json
    },
    "web": {
      "favicon": "./assets/icons/Icons/lifters-icon-google-play.jpg"
    },
    "plugins": [
      [
        "expo-image-picker",
        {
          "photosPermission": "Lifters needs access to your photos, so people can see your profile picture. And you can see theirs.",
        }
      ],

      [
        "expo-notifications",
        {
          "icon": "./assets/icons/Icons/lifters-icon-google-play.png",
          "color": "#ffffff"
        }
      ]

    ],

    "extra": {
      "eas": {
        "projectId": "582a0732-cf70-4195-8406-f6a504968a49"
      }
    }
  }
}
