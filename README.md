# Indra - Research Mobile Web Browser

Indra is a minimalistic mobile web browser for both Android and iOS devices. With Indra, you can browse the web like you would normally do with any other web browser, but Indra comes with curation tools for tagging and categorizing websites. The core idea behind Indra is to be able to map your browsing habits and compare them to others creating a network of nodes in which we are all connected. 
Indra is built on top of the Chromium engine and uses a webview to render web pages. The rest of the app is built using React Native and several contributing libraries.

## Getting Started
To get started quickly, you can clone / fork this repo, and run `yarn install` to install all of the necessary libraries. You will need the `react-native-cli` installed globally on your system in order to run Indra on your system. We also highly recommend acquiring the SDK tools necessary for the systems you which to run on (Android SDK or iOS). Indra can run fine on both emulator or device.

Bootstrapping code not provided (Android or ios folders). You can acquire this depending on your preferred device by initializing Indra within an ejected `react-native-cli` or build on top of Expo.

## Technical
* Android SDK / SDK Tools (API Level 23+) OR XCode (Sierra+)
* NodeJS 8.x
* React-Native-Cli
* Firebase

## Back-End
Indra also utilizes Firebase and Firestore for several cloud functions which aggregate users' data into one central database for further internal research.
[Indra Server](https://github.com/RefuseTheTerms/Indra-Server)

## Contributing
We want the community to continue using and developing Indra along side us. If you would like to contribute to Indra, submitting issue reports and pull requests with solutions would be the exact way to contribute.

## License
GPLv3




