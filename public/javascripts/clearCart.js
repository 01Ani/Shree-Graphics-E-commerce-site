(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const clearCartBtn = document.querySelector("#clear-cart-btn");

    if (clearCartBtn) {
      clearCartBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        const confirmed = confirm("Are you sure you want to clear the cart?"); //gives an alert for okay or cancel
        if (!confirmed) return;

        try {
          const response = await fetch("/cart/clear"); //fetch from that route
          if (response.redirected) {
            //in that route make sure it is getting redirected and if it is, do below.
            window.location.href = response.url;
            //window.location.href tells the browser to navigate to a new page (like typing a URL in the address bar).
            //response.url gives you the URL the server redirected to.

            /*NOTE: redirect does not directly work on the route itself until and unless it is made to work in this fetch statement */
          }
        } catch (err) {
          console.error("Failed to clear cart", err);
          alert("Something went wrong!");
        }
      });
    }
  });
})();
