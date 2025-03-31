(() => {
  "use strict";
  //fetching all th forms which have a class of validated form
  const forms = document.querySelectorAll(".validated-form"); //fetching all th forms which have a class of validated form
  //converting forms to array using from(forms)
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        //checkValidity() is a built in method.
        //here it works only if the case validity is false, statemtents below it is triggered
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        //adding bootstrap class of was-validated after validation, gives green border
        form.classList.add("was-validated");
      },
      false
    );
  });
})();
