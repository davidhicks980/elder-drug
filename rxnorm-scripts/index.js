// Imports
const firestoreService = require("firestore-export-import");
const serviceAccount = require("./keys/elder-drug-firebase-adminsdk-e1g1r-a177034ad8.json");
const firebaseConfig = {
  apiKey: "AIzaSyDNgPNYRgq-pgh0ISC0kBDORL6Y_SfRxpU",
  databaseURL: "https://elder-drug.firebaseio.com",
  projectId: "elder-drug",
  storageBucket: "elder-drug.appspot.com",
  messagingSenderId: "589933100918",
  appId: "1:589933100918:web:880a8a681d202e39c58457",
  measurementId: "G-M7GEQ8RSJD",
};

// JSON To Firestore
const jsonToFirestore = async () => {
  try {
    console.log("Initialzing Firebase");
    await firestoreService.initializeApp(
      serviceAccount,
      firebaseConfig.databaseURL
    );
    console.log("Firebase Initialized");

    await firestoreService.restore("./database/export_202008151819.json");
    console.log("Upload Success");
  } catch (error) {
    console.log(error);
  }
};

jsonToFirestore();
