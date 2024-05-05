export default class CurrentUserDTO {
    name
    email
    age
    role
    cart
  
    constructor(data) {
      if (data.first_name || data.last_name)
        this.name = `${data.first_name || ''} ${data.last_name || ''}`
  
      this.email = data.email
      this.age = data.age
      this.role = data.role
      this.cart = data.cart
      this.lastConnection = data.lastConnection
    }
  }