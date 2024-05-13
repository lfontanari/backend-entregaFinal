/* global Swal */

/*const cartProducts = document.querySelector('.cart-products')
const cartId = JSON.parse(document.querySelector('script[data]').getAttribute('data'))
const buyButton = document.querySelector('.buy-button') 

cartProducts.addEventListener('click', async (e) => {
  const clickedElement = e.target
  const classArray = Array.from(clickedElement.classList)

  const productId = clickedElement.getAttribute('product-id')

  if (clickedElement.tagName !== 'BUTTON') return

  // Handleclick for remove button
  if (classArray.includes('remove-button')) {
    const result = window.confirm('¿Está seguro de eliminar el producto?')

    if (result) {
      const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
        method: 'DELETE',
      })

      if (response.status === 200) return window.location.reload()
    }
  }

  // Handleclick for update button
  if (classArray.includes('update-button')) {
    const newQuantity = clickedElement.parentElement.querySelector('.quantity').value

    const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quantity: newQuantity,
      }),
    })

    if (response.status === 200) return window.location.reload()
  }
})

buyButton.addEventListener('click', async () => {
  try {
    const response = await fetch(`/api/carts/${cartId}/purchase`, {
      method: 'PUT',
    })

    if (!response.ok) {
      const { error } = await response.json()
      throw new Error(error)
    }

    const { status, payload, error } = await response.json()

    if (status === 'success') {
      const { ticket, productIdsWithInvalidStock } = payload
      const date = new Date(ticket.purchaseDateTime)
      const stringDate = date.toLocaleString()

      Swal.fire({
        title: 'Ticket de compra',
        icon: 'success',
        html: `<p>El ticket de compra se ha generado correctamente</p>
        <p>Código de ticket: <b>${ticket.code}</b></p>
        <p>Fecha de compra: <b>${stringDate}</b></p>
        <p>Email: <b>${ticket.purchaser}</b></p>
        <p>Importe total: <b>$${ticket.amount}</b></p>
        ${
          productIdsWithInvalidStock.length > 0
            ? `<p>Productos sin stock: <b>${productIdsWithInvalidStock}</b></p>`
            : ''
        } `,
        confirmButtonText: 'Cerrar y volver a la tienda',
      }).then((result) => {
        if (result.isDismissed) return window.location.reload()

        if (result.isConfirmed) {
          return window.location.replace('/users/products')
        }
      })
    } else {
      throw new Error(error)
    }
  } catch (e) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      title: 'Error en el proceso de compra',
      text: `${e.message}`,
      icon: 'error',
    })
  }
})
*/