// fetchTest.js ili u nekom komponentu, npr. App.jsx
function testServerConnection() {
  fetch("http://127.0.0.1:5000/ping")  // URL servera
    .then(response => response.json())
    .then(data => {
      console.log("Server response:", data); // tu će se pojaviti {message: "pong"}
    })
    .catch(error => {
      console.error("Error connecting to server:", error);
    });
}

// pozovi funkciju gde ti odgovara, npr. na klik ili automatski
testServerConnection();
