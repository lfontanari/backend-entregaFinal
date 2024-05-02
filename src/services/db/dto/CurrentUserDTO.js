export default class CurrentUserDTO {
    name
    email
    age
    role
    cart
  
    constructor(data) {
      if (data.firstName || data.lastName)
        this.name = `${data.firstName || ''} ${data.lastName || ''}`
  
      this.email = data.email
      this.age = data.age
      this.role = data.role
      this.cart = data.cart
      this.lastConnection = data.lastConnection
    }
  }