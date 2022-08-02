import Swal from "sweetalert2";
const adress = "https://dendroapi.alwaysdata.net/";
//USERS
function getUsers(callback) {
  fetch(adress + "users")
    .then((response) => {
      response.json().then((response) => {
        callback(response);
      });
    })
    .catch((e) =>
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong with the connection to the DB!",
        footer:
          "Try reload the app and check your internet connection. If the problem persist try contacting an administrator",
      })
    );
}

function createUser(newUser, callback) {
  fetch(adress + "users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newUser),
  })
    .then((response) => {
      return response.text();
    })
    .then((res) => {
      Swal.fire({
        title: "User created !",
        icon: "success",
        timer: "1000",
      });
      callback(res);
    })
    .catch((e) =>
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong with the connection to the DB!",
        footer:
          "Try reload the app and check your internet connection. If the problem persist try contacting an administrator",
      })
    );
}

function editUser(id, newUser, callback) {
  fetch(adress + `users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newUser),
  })
    .then((response) => {
      return response.text();
    })
    .then((res) => {
      Swal.fire({
        title: "Users updated !",
        icon: "success",
        timer: "1000",
      });
      callback(res);
    })
    .catch((e) =>
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong with the connection to the DB!",
        footer:
          "Try reload the app and check your internet connection. If the problem persist try contacting an administrator",
      })
    );
}

function deleteUser(id, callback) {
  fetch(adress + `users/${id}`, {
    method: "DELETE",
  })
    .then((response) => {
      callback(response);
    })
    .catch((e) =>
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong with the connection to the DB!",
        footer:
          "Try reload the app and check your internet connection. If the problem persist try contacting an administrator",
      })
    );
}

//SITES
function getSites(callback) {
  fetch(adress + "sites")
    .then((response) => {
      response.json().then((response) => {
        callback(response);
      });
    })
    .catch((e) =>
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong with the connection to the DB!",
        footer:
          "Try reload the app and check your internet connection. If the problem persist try contacting an administrator",
      })
    );
}

function createSite(newSite, callback) {
  fetch(adress + "sites", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newSite),
  })
    .then((response) => {
      return response.text();
    })
    .then((res) => {
      callback(res);
      Swal.fire({
        title: "Site created !",
        icon: "success",
        timer: "1000",
      });
    })
    .catch((e) =>
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong with the connection to the DB!",
        footer:
          "Try reload the app and check your internet connection. If the problem persist try contacting an administrator",
      })
    );
}

function editSite(id, newSite, callback) {
  fetch(adress + `sites/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newSite),
  })
    .then((response) => {
      return response.text();
    })
    .then((res) => {
      callback(res);
      Swal.fire({
        title: "Site updated !",
        icon: "success",
        timer: "1000",
      });
    })
    .catch((e) =>
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong with the connection to the DB!",
        footer:
          "Try reload the app and check your internet connection. If the problem persist try contacting an administrator",
      })
    );
}

function deleteSite(id, callback) {
  fetch(adress + `sites/${id}`, {
    method: "DELETE",
  })
    .then((response) => {
      callback(response);
    })
    .catch((e) =>
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong with the connection to the DB!",
        footer:
          "Try reload the app and check your internet connection. If the problem persist try contacting an administrator",
      })
    );
}

//KEYWORDS
function getKeywords(callback) {
  fetch(adress + "keywords")
    .then((response) => {
      response.json().then((response) => {
        callback(response);
      });
    })
    .catch((e) =>
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong with the connection to the DB!",
        footer:
          "Try reload the app and check your internet connection. If the problem persist try contacting an administrator",
      })
    );
}

//SPECIE
function getSpecies(callback) {
  fetch(adress + "species")
    .then((response) => {
      response.json().then((response) => {
        callback(response);
      });
    })
    .catch((e) =>
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong with the connection to the DB!",
        footer:
          "Try reload the app and check your internet connection. If the problem persist try contacting an administrator",
      })
    );
}

// LAB
function getLaboratories(callback) {
  fetch(adress + "laboratories")
    .then((response) => {
      response.json().then((response) => {
        callback(response);
      });
    })
    .catch((e) =>
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong with the connection to the DB!",
        footer:
          "Try reload the app and check your internet connection. If the problem persist try contacting an administrator",
      })
    );
}

function createLaboratory(newLab, callback) {
  fetch(adress + "laboratories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newLab),
  })
    .then((response) => {
      return response.text();
    })
    .then((res) => {
      callback(res);
      Swal.fire({
        title: "Laboratory created !",
        icon: "success",
        timer: "1000",
      });
    })
    .catch((e) =>
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong with the connection to the DB!",
        footer:
          "Try reload the app and check your internet connection. If the problem persist try contacting an administrator",
      })
    );
}

function editLaboratory(id, newLab, callback) {
  fetch(adress + `laboratories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newLab),
  })
    .then((response) => {
      return response.text();
    })
    .then((res) => {
      callback(res);
      Swal.fire({
        title: "Laboratory updated !",
        icon: "success",
        timer: "1000",
      });
    })
    .catch((e) =>
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong with the connection to the DB!",
        footer:
          "Try reload the app and check your internet connection. If the problem persist try contacting an administrator",
      })
    );
}
function deleteLaboratory(id, callback) {
  fetch(adress + `laboratories/${id}`, {
    method: "DELETE",
  })
    .then((response) => {
      callback(response);
    })
    .catch((e) =>
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong with the connection to the DB!",
        footer:
          "Try reload the app and check your internet connection. If the problem persist try contacting an administrator",
      })
    );
}

//WOODS

function getWoods(callback) {
  fetch(adress + "woods")
    .then((response) => {
      response.json().then((response) => {
        callback(response);
      });
    })
    .catch((e) =>
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong with the connection to the DB!",
        footer:
          "Try reload the app and check your internet connection. If the problem persist try contacting an administrator",
      })
    );
}

function createWood(newWood, callback) {
  fetch(adress + "woods", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newWood),
  })
    .then((response) => {
      return response.text();
    })
    .then((res) => {
      callback(res);
      Swal.fire({
        title: "Wood created !",
        icon: "success",
        timer: "1000",
      });
    })
    .catch((e) =>
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong with the connection to the DB!",
        footer:
          "Try reload the app and check your internet connection. If the problem persist try contacting an administrator",
      })
    );
}

function editWood(id, newWood, callback) {
  fetch(adress + `woods/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newWood),
  })
    .then((response) => {
      return response.text();
    })
    .then((res) => {
      callback(res);
      Swal.fire({
        title: "Wood updated !",
        icon: "success",
        timer: "1000",
      });
    })
    .catch((e) =>
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong with the connection to the DB!",
        footer:
          "Try reload the app and check your internet connection. If the problem persist try contacting an administrator",
      })
    );
}

function deleteWood(id, callback) {
  fetch(adress + `woods/${id}`, {
    method: "DELETE",
  })
    .then((response) => {
      callback(response);
    })
    .catch((e) =>
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong with the connection to the DB!",
        footer:
          "Try reload the app and check your internet connection. If the problem persist try contacting an administrator",
      })
    );
}

module.exports = {
  getUsers,
  createUser,
  editUser,
  deleteUser,
  getSites,
  createSite,
  editSite,
  deleteSite,
  getLaboratories,
  createLaboratory,
  editLaboratory,
  deleteLaboratory,
  getWoods,
  createWood,
  editWood,
  deleteWood,
  getKeywords,
  getSpecies,
};
