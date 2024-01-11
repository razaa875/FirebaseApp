import {
  collection,
  db,
  doc,
  getDocs,
  addDoc,
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  app,
  storage,
  deleteDoc,
  getDoc,
  updateDoc
} from "./firebase.js";

var parent = document.getElementById("parent");
var exampleModal1 = document.getElementById("exampleModal1");

var myModal = new bootstrap.Modal(document.getElementById("exampleModal1"), {
  keyboard: false,
});var editModal = new bootstrap.Modal(document.getElementById("editModal"), {
  keyboard: false,
});

window.addEventListener("load", async function () {
  console.log("blog load");
  var uid = localStorage.getItem("uid");
  console.log(uid, "uid");

  if (!uid) {
    location.replace("./index.html");
    return;
  }
  var BlogArr = [];
  const querySnapshot = await getDocs(collection(db, "blogs"));
  querySnapshot.forEach(function (doc) {
    // console.log(doc.data().tilte);
    // console.log(doc.id);
    // BlogArr.push(doc.data());
    BlogArr.push({
      tilte: doc.data().tilte,
      desc: doc.data().desc,
      uid: doc.data().uid,
      image: doc.data().image,
      blogId: doc.id,
      isPrivate: doc.data().isPrivate,
    });
  });
  // console.log(BlogArr, "BlogArr");

  // for of loop

  for (var value of BlogArr) {
    // renderCardUI(title, desc, image, id)

    console.log(value.isPrivate, "BlogArr value");
    if (value.isPrivate) {
      if (value.uid === uid) {
        parent.innerHTML += renderCardUI(
          value.tilte,
          value.desc,
          value.image,
          value.blogId,
          value.isPrivate
        );
      }
    } else {
      parent.innerHTML += renderCardUI(
        value.tilte,
        value.desc,
        value.image,
        value.blogId,
        value.isPrivate
      );
    }
  }
});

async function createBlog() {
  var blogImage = document.getElementById("blogImage");
  var imageURL;

  if (blogImage.files.length > 0) {
    imageURL = await imageUpload(blogImage.files[0]);
  } else {
    imageURL = "https://picsum.photos/200/300";
  }
  // var imageURL = await imageUpload(blogImage.files[0]);
  // console.log("imageURL", imageURL);
  // console.log("createBlog");
  var title = document.getElementById("title");
  var desc = document.getElementById("desc");
  var uid = localStorage.getItem("uid");
  var privatePost = document.getElementById("privatePost").checked;

  var blogObj = {
    tilte: title.value,
    desc: desc.value,
    uid: uid,
    image: imageURL,
    imageName: blogImage.files.length > 0 ? blogImage.files[0].name : null,
    isPrivate: privatePost,
  };

  const docRef = await addDoc(collection(db, "blogs"), blogObj);

  parent.innerHTML += renderCardUI(
    title.value,
    desc.value,
    imageURL,
    docRef.id,
    privatePost
  );
  myModal.hide();
  title.value = "";
  desc.value = "";
  console.log("docRef", docRef);
}

function renderCardUI(title, desc, image, id, isPrivate) {
  console.log("UI isPrivate", isPrivate);

  var lockValue = "";
  if (isPrivate) {
    lockValue = `<i class="fa-solid fa-lock"></i>`;
  } else {
    lockValue = "";
  }

  var UI = `<div class="card" style="width: 18rem">
  <img
    src=${image}
    class="card-img-top"
    alt="..."
    id="blogImage"
  />
  <div class="card-body">
    <h5 class="card-title"> ${title} ${lockValue}  </h5>
    <p class="card-text">
      ${desc}
    </p>
    
    <button class="btn btn-danger" id=${id}  onclick="deleteBlog(this)" >DELETE</button>
    <button
      type="button"
      class="btn btn-info"
      data-bs-toggle="modal"
      data-bs-target="#editModal" 
      id=${id} 
      onclick="editBlog(this)"    >
      EDIT
    </button>
    </div>
</div>`;

  return UI;
}
var EditModal = new bootstrap.Modal(document.getElementById("editModal"), {
  keyboard: false,
});
async function deleteBlog(ele) {
    console.log("deleteBlog" , ele.id);
  var blogId = ele.id;
  await deleteDoc(doc(db, "blogs", blogId));
  window.location.reload()
}

// async function editBlog(ele) {
//   console.log("editBlog ID",ele.id);
//   var blogId = ele.id;

//   // Fetch the blog data using the blogId
//   const blogDoc = await getDoc(doc(db, "blogs", blogId));

//   // Extract the data from the document
//   const blogData = blogDoc.data();

//   // Fill the input fields in the modal with the retrieved data
//   document.getElementById("title").value = blogData.tilte;
//   document.getElementById("desc").value = blogData.desc;
//   document.getElementById("privatePost").checked = blogData.isPrivate;

//   // Show the modal
//   editModal.show();

//   document.getElementById("updateBtn").addEventListener("click", async function () {
//     // Update the blog data with the new values
//     const updatedData = {
//       tilte: document.getElementById("title").value,
//       desc: document.getElementById("desc").value,
//       isPrivate: document.getElementById("privatePost").checked,
//     };

//     // Update the document in the database
//     await updateDoc(doc(db, "blogs", blogId), updatedData);
//     const existingCard = document.getElementById(blogId);
//     if (existingCard) {
//       existingCard.innerHTML = renderCardUI(
//         updatedData.tilte,
//         updatedData.desc,
//         blogData.image,
//         blogId,
//         updatedData.isPrivate
//       );
//     }
//     editModal.hide();
//     // Reload the page or update the UI as needed
//     // For example, you can reload the page to reflect the changes
//     window.location.reload();
//   });
// }
async function editBlog(ele) {
  console.log("editBlog ID", ele.id);
  var blogId = ele.id;

  // Fetch the blog data using the blogId
  const blogDoc = await getDoc(doc(db, "blogs", blogId));

  // Extract the data from the document
  const blogData = blogDoc.data();

  // Fill the input fields in the modal with the retrieved data
  document.getElementById("editTitle").value = blogData.tilte;
  document.getElementById("editDesc").value = blogData.desc;
  document.getElementById("editPrivatePost").checked = blogData.isPrivate;

  // Show the modal
  editModal.show();

  // Add a one-time event listener to the "Update" button
  document.getElementById("updateBtn").addEventListener("click", async function () {
    // Update the blog data with the new values
    const updatedData = {
      tilte: document.getElementById("editTitle").value,
      desc: document.getElementById("editDesc").value,
      isPrivate: document.getElementById("editPrivatePost").checked,
    };

    // Check if a new image file has been selected
    const newImageFile = document.getElementById("editBlogImage").files[0];
    if (newImageFile) {
      // Upload the new image and get the download URL
      updatedData.image = await imageUpload(newImageFile);
      updatedData.imageName = newImageFile.name;
    } else {
      // Use the existing image URL if no new image is selected
      updatedData.image = blogData.image;
      updatedData.imageName = blogData.imageName;
    }

    // Update the document in the database
    await updateDoc(doc(db, "blogs", blogId), updatedData);

    // Update the UI
    const existingCard = document.getElementById(blogId);
    if (existingCard) {
      existingCard.innerHTML = renderCardUI(
        updatedData.tilte,
        updatedData.desc,
        updatedData.image,
        blogId,
        updatedData.isPrivate
      );
    }

    // Hide the modal
    editModal.hide();
    console.log("Modal closed");
    window.location.reload()
  }, { once: true });
}



function imageUpload(file) {
  return new Promise(function (resolve, reject) {
    // Create the file metadata
    /** @type {any} */
    const metadata = {
      contentType: "image/jpeg",
    };

    // Upload file and metadata to the object 'images/mountains.jpg'
    const storageRef = ref(storage, "images/" + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            break;
          case "storage/canceled":
            // User canceled the upload
            break;

          // ...

          case "storage/unknown":
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          resolve(downloadURL);
        });
      }
    );
  });
}

function logoutFunction() {
  localStorage.clear();
  window.location.replace("./index.html");
}
//assign function
window.deleteBlog = deleteBlog;
window.editBlog = editBlog;
window.createBlog = createBlog;
window.logoutFunction = logoutFunction;