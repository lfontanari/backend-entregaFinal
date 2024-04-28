import  {expect}  from 'chai';
import supertest from 'supertest';


//const expect = chai.expect;

const requester = supertest('http://localhost:9090');


describe("Testing Ecommerce App", () => {

    // before()
    // beforeEach()
    /*=============================================
    =                   Section02                 =
    =============================================*/
    describe("Testing login and session with Cookies:", () => {

        before(function () {
            this.cookie;
            this.mockUser = {
                first_name: "Lorena",
                last_name: "Apellido",
                email: "lorena@gmail.com",
                age:52,
                password: "123456"
               
            };
        })

        // TEST 01
        it("Test Registro Usuario: Debe poder registrar correctamente un usuario", async function () {
            // Given


            // Then
            const { statusCode } = await requester.post("/api/sessions/register").send(this.mockUser);


            // Assert
            expect(statusCode).is.eql(201)
        })

        // TEST 02
        it("Test Login Usuario: Debe poder hacer login correctamente con el usuario registrado previamente", async function () {
            // Given
            const mockLogin = {
                email: this.mockUser.email,
                password: this.mockUser.password
            }


            // Then
            const result = await requester.post("/api/sessions/login").send(mockLogin);
            //console.log(result);
            const cookieResult = result.headers['set-cookie'][0]

            // Assert
            expect(result.statusCode).is.eql(200)

            const cookieData = cookieResult.split("=")
            this.cookie = {
                name: cookieData[0],
                value: cookieData[1]
            }
            expect(this.cookie.name).to.be.ok.and.eql('coderCookie');
            expect(this.cookie.value).to.be.ok
        })

/*
        // Test 03
        it("Test Ruta Protegida: Debe enviar la cookie que contiene el usuario y destructurarla correctamente.", async function () {
            //Given:
            //console.log(this.cookie);

            //Then:
            const { _body } = await requester.get("/api/sessions/current").set('Cookie', [`${this.cookie.name}=${this.cookie.value}`]);
            // console.log(_body);

            //AssertThat:
            expect(_body.payload.email).to.be.ok.and.eql(this.mockUser.email);
        });

*/

    })

    /*=============================================
    =                   Section01                 =
    =============================================*/
    describe("Testing Products Api", () => {

        // before()
        // beforeEach()

        // TEST 01
        it("Crear Producto: El API POST /api/products debe crear un nuevo producto correctamente", async () => {
            // Given
            const productMock = {
                title :"Genérico Ladrillo Pescadteso",
                description:"The beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients",
                price:"887.00",
                thumbnail:"https://loremflickr.com/640/480/business",
                code:"HN71AKIww555wW",
                stock:"5",
                category:"Bricolaje"
            }


            // Then
            const { statusCode, ok, _body } = await requester.post('/api/products').send(productMock);
            


            // Assert that
            expect(statusCode).is.eqls(201)
            //expect(_body.payload).is.ok.and.to.have.property('_id')
            //expect(_body.payload.status).to.eql(true)
            //expect(_body.payload).to.have.property('owner').and.to.be.deep.equal('admin');
        })

        
   

    })



})