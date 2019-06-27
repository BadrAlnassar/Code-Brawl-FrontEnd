// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyCQzyMH-DGHeuYjuefdjzrR3y_k5E67yYY",
    authDomain: "code-brawl.firebaseapp.com",
    databaseURL: "https://code-brawl.firebaseio.com",
    projectId: "code-brawl",
    storageBucket: "code-brawl.appspot.com",
    messagingSenderId: "585147751336",
    appId: "1:585147751336:web:38c91939569aa29d"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
var challengesRef = db.collection("challenges");

function findChallenge() {
    var challenges = challengesRef.where("started", "==", false);
    var challengeFound = false;

    challenges.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            var data = doc.data()
            console.log(doc.id, ' => ', data);

            if (!data.started) {
                joinChallenge(doc.id);
                challengeFound = true;
                break;
            }
        });
    });

    if (!challengeFound) {
        createChallenge();
    }
}

function createChallenge() {
    var name = document.getElementById("name").value;
    var data = {
        'playerOne': name,
        'questions': generateQuestions(),
        'points': [0, 0],
        'started': false,
        'progress': [0, 0]
    }

    var newChallengeRef = db.collection("challenges").doc().set(data)
        .then(function() {
            console.log("Document successfully written!");
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });;

    newChallengeRef.onSnapShot(function(doc) {
        alert(doc.data().playerTwo + ' Joined!');
    });
}

function joinChallenge(id) {
    var challengeRef = db.collection("challenges").doc(id);
    var name = document.getElementById("name").value;

    challengeRef.update({
        'playerTwo': name,
        'started': true,
        'startingTime': firebase.firestore.FieldValue.serverTimestamp(),
        'playerOneTime': firebase.firestore.FieldValue.serverTimestamp(),
        'playerTwoTime': firebase.firestore.FieldValue.serverTimestamp()
    });

    challengeRef.onSnapShot(function(doc) {
        alert('You Joined ' + doc.data().playerOne + '!');
    });
}

function generateQuestions() {
    var questions = []
    while (questions.length < 3) {
        var question = Math.floor(Math.random() * 30) + 1;
        if (questions.indexOf(question) === -1) {
            questions.push(question);
        }
    }
}
