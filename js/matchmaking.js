var button = document.getElementById("Login"); 

button.addEventListener("click", () => {
findChallenge();
})
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
var currentChallenge = null;
var challengeListener = null;

async function findChallenge() {
    var challenges = challengesRef.where("started", "==", false);
	var challengeFound = false;

    await challenges.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            var data = doc.data()
            console.log(doc.id, ' => ', data);

            if (!data.started) {
                joinChallenge(doc.id);
                challengeFound = true;
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
        'points': [0, 0],
        'questions': generateQuestions(),
        'started': false,
        'progress': [0, 0]
    }

    var newChallengeRef = db.collection("challenges").doc();

	newChallengeRef.set(data)
        .then(function() {
            console.log("Document successfully written!");
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });;

    currentChallenge = newChallengeRef;

    newChallengeRef.onSnapshot(function(doc) {
        data = doc.data()
        if (data.started) {
            alert(doc.data().playerTwo + ' Joined!');
        }
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

    challengeRef.get().then(function(doc) {
	    if (doc.exists) {
			alert('You Joined ' + doc.data().playerOne + '!');
	        console.log("Document data:", doc.data());
	    } else {
	        console.log("No such document!");
	    }
	}).catch(function(error) {
	    console.log("Error getting document:", error);
	});
}

function cancelChallenge() {
    currentChallenge.delete().then(function() {
        console.log("Document successfully deleted!");
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });
}

function generateQuestions() {
    var questions = []
    while (questions.length < 3) {
        var question = Math.floor(Math.random() * 30);
        if (questions.indexOf(question) === -1) {
            questions.push(question);
        }
    }
    return questions;
}