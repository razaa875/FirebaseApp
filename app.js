import { db, doc, getAuth, signInWithEmailAndPassword, getDoc} from "./firebase.js";

const auth = getAuth();

function loginFunc(){
    var email = document.getElementById("email")
    var password = document.getElementById("password")

    signInWithEmailAndPassword(auth, email.value, password.value)
        .then(async function(success){
            console.log("Success", success)
            var docRef = doc(db, "users", success.user.uid)
            var docSnap = await getDoc(docRef)

            if(docSnap.exists()){
                console.log("Document Data: ", docSnap.data())
                localStorage.setItem("uid", success.user.uid)
                localStorage.setItem("userData", JSON.stringify(docSnap.data()))
                alert("Successfully Login")
                window.location.replace("./dashboard.html")
            }
            else{
                alert("Something Went Wrong!!")
                console.log("No Data Found")
            }
            var userData;
        })
        .catch( function(error){
            console.log(error.code, "Error")
            alert(error.code)
        })
}

window.addEventListener("load", function(){
    console.log("Dashboard Load")
    var uid = localStorage.getItem("uid")
    if(uid){
        this.location.replace("./dashboard.html")
        return
    }
})

window.loginFunc = loginFunc