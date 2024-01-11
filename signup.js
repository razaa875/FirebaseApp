import {
  getAuth,
  createUserWithEmailAndPassword,
  db,
  setDoc,
  doc,
} from "./firebase.js";

const auth = getAuth();

function signupFunc() {
  var firstName = document.getElementById("firstName");
  var lastName = document.getElementById("lastName");
  var phoneNumber = document.getElementById("phoneNumber");
  var email = document.getElementById("email");
  var password = document.getElementById("password");

  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then(async function (success) {
      console.log("Successfully Signed up", success);

      var userObj = {
        user_id: success.user.uid,
        firstName: firstName.value,
        lastName: lastName.value,
        phoneNumber: phoneNumber.value,
        email: email.value,
      };

      await setDoc(doc(db, "users", success.user.uid), userObj);

      alert("User Successfully Signup");
      window.location.href = "./index.html";
    })

    .catch(function (error) {
      console.log("Error", error.code);
    });
}

window.addEventListener("load", function(){
  console.log("Dashboard Load")
  var uid = localStorage.getItem("uid")
  if(uid){
      this.location.replace("./dashboard.html")
      return
  }
})

window.signupFunc = signupFunc;
