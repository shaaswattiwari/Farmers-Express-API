/*both the forms*/
const postform = document.querySelector(".postform");
const getform = document.querySelector(".getform");

/*selecting all submit buttons and input[type="text"] elements*/
const submitbutton = document.querySelectorAll(".submitbutton");
const inputtext = document.querySelectorAll('input[type="text"]');

/*output area*/
const responsedata = document.querySelector(".responsedata");

/*on post submission*/

postform.addEventListener("submit", async (event) => {
  event.preventDefault(); //preventing default submission
  responsedata.innerHTML = ""; //clearning the response area
  submitbutton.forEach((btn) => btn.setAttribute("disabled", true));

  //converting formData to customized object
  const formEntries = new FormData(event.target).entries();
  const formData = Object.assign(
    ...Array.from(formEntries, ([name, value]) => ({ [name]: value }))
  );

  //clearning all the input fields
  inputtext.forEach((input) => (input.value = ""));
  try {
    var response = await fetch(event.target.action, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reportDetails: formData }),
    });
    var data = await response.json();
    responsedata.innerText = JSON.stringify(data, null, 2);
    submitbutton.forEach((btn) => btn.removeAttribute("disabled")); //enabling all buttons again
  } catch (e) {
    submitbutton.forEach((btn) => btn.removeAttribute("disabled")); //enabling all buttons again
    responsedata.innerText = e;
  }
});

/*on get submission*/

getform.addEventListener("submit", async (event) => {
  event.preventDefault(); //preventing default submission
  var reportID = document.querySelector(".reportID").value; //collecting the entered reportID
  responsedata.innerHTML = ""; //clearning the response area
  inputtext.forEach((input) => (input.value = "")); //clearning all the input fields
  submitbutton.forEach((btn) => btn.setAttribute("disabled", true));
  try {
    var response = await fetch(`${event.target.action}?reportID=${reportID}`);
    var data = await response.json();
    responsedata.innerText = JSON.stringify(data, null, 2);
    submitbutton.forEach((btn) => btn.removeAttribute("disabled")); //enabling all buttons again
  } catch (e) {
    submitbutton.forEach((btn) => btn.removeAttribute("disabled")); //enabling all buttons again
    responsedata.innerText = e;
  }
});
