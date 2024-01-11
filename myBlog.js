import {
  getDocs,
  collection,
  db,
  query,
  where,
  deleteDoc,
  doc,
  addDoc,
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  app,
  storage,
  getDoc,
  updateDoc,
} from "./firebase.js";

var parent = document.getElementById("parent");
window.addEventListener("load", async function () {
  var uid = localStorage.getItem("uid");
  console.log(uid, "uid");

  if (!uid) {
    location.replace("./index.html");
    return;
  } else {
    // var BlogArr = [];
    // const querySnapshot = await getDocs(collection(db, "blogs"));
    // querySnapshot.forEach(function (doc) {
    //   if (uid === doc.data().uid) {
    //     BlogArr.push({
    //       tilte: doc.data().tilte,
    //       desc: doc.data().desc,
    //       uid: doc.data().uid,
    //       image: doc.data().image,
    //       blogId: doc.id,
    //       isPrivate: doc.data().isPrivate,
    //     });
    //   }
    // });
    // console.log(BlogArr, "BlogArr");

    // Create a query against the collection.
    var q = query(collection(db, "blogs"), where("uid", "==", uid));

    const querySnapshot = await getDocs(q);
    var myBLogArr = [];
    querySnapshot.forEach(function (doc) {
      var data = doc.data();
      myBLogArr.push({
        tilte: data.tilte,
        desc: data.desc,
        uid: data.uid,
        image: data.image,
        blogId: doc.id,
        isPrivate: data.isPrivate,
      });
    });
    // console.log(myBLogArr, "myBLogArr");
    myBLogArr = myBLogArr.filter(function (item) {
      return item.isPrivate == true;
    });
    if (myBLogArr.length > 0) {
      for (var value of myBLogArr) {
        // renderCardUI(title, desc, image, id)
        parent.innerHTML += renderCardUI(
          value.tilte,
          value.desc,
          value.image,
          value.blogId,
          value.isPrivate
        );
      }
    } else {
      parent.innerHTML = "<h1>NO BLOG FOUND</h1>";
    }
  }
});

function renderCardUI(title, desc, image, id, isPrivate) {
  console.log("UI isPrivate", isPrivate);

  var lockValue = "";
  if (isPrivate) {
    lockValue = `<i class="fa-solid fa-lock"></i>`;
  } else {
    lockValue = "";
  }
  //   var imageGet =
  // var UI = `<div class="card" style="width: 18rem">
  //     <img
  //       src="${image}"
  //       class="card-img-top"
  //       alt="..."
  //     />
  //     <div class="card-body">
  //       <h5 class="card-title"> ${title} ${lockValue}  </h5>
  //       <p class="card-text">
  //         ${desc}
  //       </p>
  
  //       <button class="btn btn-danger" id=${id}  onclick="deleteBlog(this)" >DELETE</button>
  //       <button
  //         type="button"
  //         class="btn btn-info"
  //         data-bs-toggle="modal"
  //         data-bs-target="#exampleModal1" 
  //       >
  //         EDIT
  //       </button>
  //       <div
  //       class="modal fade"
  //       id="exampleModal1"
  //       tabindex="-1"
  //       aria-labelledby="exampleModalLabel"
  //       aria-hidden="true"
  //     >
  //       <div class="modal-dialog">
  //         <div class="modal-content">
  //           <div class="modal-header">
  //             <h5 class="modal-title" id="exampleModalLabel">EDIT BLOG</h5>
  //             <button
  //               type="button"
  //               class="btn-close"
  //               data-bs-dismiss="modal"
  //               aria-label="Close"
  //             ></button>
  //           </div>
  //           <div class="modal-body">
  //             <input
  //               type="text"
  //               class="form-control"
  //               placeholder="Enter Title"
  //               id="title"
  //             />
  //             <textarea
  //               id="desc"
  //               type="text"
  //               class="form-control mt-2"
  //               placeholder="Enter Desc"
  //             ></textarea>
  //             <input type="file" class="mt-2" id="blogImage" />
  //             <br /><br />
  //             <label for="">
  //               <input type="checkbox" id="privatePost" />
  //               Private Post
  //             </label>
  //           </div>
  //           <div class="modal-footer">
  //             <button
  //               type="button"
  //               class="btn btn-secondary"
  //               data-bs-dismiss="modal"
  //               id="closeBtn"
  //             >
  //               Close
  //             </button>
  //             <button
  //             id=${id} onclick="editBlog(this)"
  //               type="button"
  //               class="btn btn-primary"
  //             >
  //               Update
  //             </button>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //       </div>
  //   </div>`;
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

async function deleteBlog(ele) {
  //   console.log("deleteBlog" , ele.id);
  var blogId = ele.id;
  await deleteDoc(doc(db, "blogs", blogId));
  window.location.reload()
}

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
  // editModal.show();

  // Add a one-time event listener to the "Update" button
  document.getElementById("updateBtn").addEventListener(
    "click",
    async function () {
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
      // editModal.hide();
      console.log("Modal closed");
      window.location.reload();
    },
    { once: true }
  );
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

window.deleteBlog = deleteBlog;
window.editBlog = editBlog;
window.logoutFunction = logoutFunction;
var arr = {};
