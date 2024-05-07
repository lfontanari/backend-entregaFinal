const form = document.getElementById('loginForm');

form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    try {
        data.forEach((value, key) => obj[key] = value);
        fetch('/api/sessions/login', {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(result => {
            if (result.status === 200) {
                console.log("Cookies generadas:");
                console.log(document.cookie);
                // alert("Login realizado con exito!");
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2000,
                    title: 'Login exitoso',
                    icon: 'success',
                  }).then(() => {
                    window.location.replace('/users/products');
                });
       
            }  else if (result.status === 204) {
                 
                // alert("Usuario no encontrado con ese username!");
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2000,
                    title: 'Error al iniciar sesión',
                    text: 'Usuario no encontrado con ese username!',
                    icon: 'error',
                  })
            } else if (result.status === 401) {
                 
                // alert("Login invalido revisa tus credenciales!");
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2000,
                    title: 'Error al iniciar sesión',
                    text: 'Login invalido revisa tus credenciales!',
                    icon: 'error',
                  })
            }
             
        })
    } catch (e) {
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          title: 'Error al iniciar sesión',
          text: `${e.message}`,
          icon: 'error',
        })
      }

})