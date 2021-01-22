const numberInput = document.getElementById("number"),
  button = document.getElementById("button"),
  response = document.querySelector(".response");

button.addEventListener("click", send, false);

function send() {
  const number = numberInput.value.replace(/\D/g, "");

  fetch("/", {
      method: "post",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        number: number
      })
    })
    .then(function (res) {
      console.log(res);
    })
    .catch(function (err) {
      console.log(err);
    });
}