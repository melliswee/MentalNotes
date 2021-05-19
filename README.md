# MentalNotes

## About MentalNotes
MentalNotes is a notebook app that encourages you to write a diary and to document your mood and other emotions. The user can also attach images to the notes. Each note has a simple page and all notes are listed on the frontpage. The app gives a simple pie chart summary of the general mood of the user. This app utilizes Firebase Realtime Database and Storage.
</br></br>
MentalNotes is a school project on Mobile Programming course at Haaga-Helia University of Applied Sciences.
***
<kbd> <img src="https://github.com/melliswee/MentalNotes/blob/main/wiki_assets/Screenshot_20210519-214027.png" width="250"> </kbd>   <kbd> <img src="https://github.com/melliswee/MentalNotes/blob/main/wiki_assets/Screenshot_20210519-213742.png" width="250"> </kbd>   <kbd> <img src="https://github.com/melliswee/MentalNotes/blob/main/wiki_assets/Screenshot_20210519-213651.png" width="250"> </kbd>
</br></br>
<kbd> <img src="https://github.com/melliswee/MentalNotes/blob/main/wiki_assets/Screenshot_20210519-213712.png" width="250"> </kbd>   <kbd> <img src="https://github.com/melliswee/MentalNotes/blob/main/wiki_assets/Screenshot_20210519-213731.png" width="250"> </kbd>   <kbd> <img src="https://github.com/melliswee/MentalNotes/blob/main/wiki_assets/Screenshot_20210519-213750.png" width="250"> </kbd>
***
If you want to give this app a go, you can find it at Expo: https://expo.io/@melliswee/projects/MentalNotes
</br></br>
If you want to develop this further, remember to create .env- file to the app root with your Firebase config information. It should look like this:
</br></br>
API_KEY="YOUR_KEY_HERE"</br>
AUTH_DOMAIN="YOUR_DOMAIN_HERE"</br>
DATABASE_URL="YOUR_DATABASE_URL_HERE"</br>
PROJECT_ID="YOUR_ID_HERE"</br>
STORAGE_BUCKET="YOUR_BUCKET_HERE"</br>
MESSAGE_SENDER_ID="YOUR_ID_HERE"</br>
APP_ID="YOUR_APP_ID_HERE"</br>
***
## Technologies and libraries

* [ReactNative](https://reactnative.dev/) 
* [Expo](https://docs.expo.io/) - Expo framework and platform for React Applications
* [Firebase and Storage](https://firebase.google.com) - As database and storage for images
* [React Native Dotenv](https://www.npmjs.com/package/react-native-dotenv) - To hide private information
* [React Navigation](https://reactnavigation.org/)
* [React Native Chart Kit](https://github.com/indiespirit/react-native-chart-kit) - For simple pie chart summary
* [React Native Community Slider](https://docs.expo.io/versions/latest/sdk/slider/) - To express mood intensity
* [Expo Checkbox](https://docs.expo.io/versions/v41.0.0/sdk/checkbox/) - To choose emotions
* [Expo ImagePicker](https://docs.expo.io/versions/v41.0.0/sdk/imagepicker/) - For taking pictures
* [Expo ImageManipulator](https://docs.expo.io/versions/v41.0.0/sdk/imagemanipulator/) - For compressing image

***
