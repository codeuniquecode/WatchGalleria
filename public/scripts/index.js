//   code for language switcher -- not completed
  document.addEventListener("DOMContentLoaded", () => {
    const radioButtons = document.querySelectorAll('input[name="language"]');
    
    radioButtons.forEach(radio => {
      radio.addEventListener("change", (event) => {
        console.log(event.target.value); 
      });
    });
  });

