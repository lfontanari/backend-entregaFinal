document.addEventListener('DOMContentLoaded', function() {
// recupero cid del usuario
const userData = JSON.parse(document.querySelector('script[data]').getAttribute('data'))

const { cart: cid } = userData;

const tableBody = document.getElementById('table-body')

tableBody.addEventListener('click', async (e) => {
  if (e.target.className === 'btn-add-to-cart') {
    const pid = e.target.getAttribute('product-id')

    try {
      const response = await fetch(`/api/carts/${cid}/products/${pid}`, {
        method: 'POST',
      })

      const { error, status } = await response.json()

      if (!response.ok || status === 'error') {
        throw new Error(error)
      }

      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        title: `Se agrego el producto al carrito`,
        icon: 'success',
      })
    } catch (error) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        title: `Error`,
        text: error.message,
        icon: 'error',
      })
    }
  }
}) 
})
