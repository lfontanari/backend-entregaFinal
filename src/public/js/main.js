document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll("[id^='addToCartButton']");
    buttons.forEach((button, index) => {
        button.addEventListener("click", () => {
             
            addItem(index);
        });
    });
});


async function addItem(index){
   console.log("estoy en addItem index: " + index);
    
   let data = await  fetch('/api/products');
   console.log("paso 2");
   console.log(data);
   let productos = await data.json();
   console.log(productos);
   console.log("paso 3");
    if (productos.data.docs && index < productos.data.docs.length) {
        // Accede a productos.docs[index] aquí
        console.log(productos.data.docs[index]);
    } else {
        console.error('Índice fuera de rango o productos no definidos.');
    }
    
    
    let cargar = await fetch(`/api/carts/658bab8dec421ffe74ca3357/product/${productos.data.docs[index]._id}`,{method:"POST"})
}

function logout(){
    fetch('/logout')
    .then(result => {
        if (result.status === 200) {
            window.location.replace('/users/login');
      
        }
    })

}