// import { faker } from '@faker-js/faker'

import signupPage from '../support/pages/signup'

describe('cadastro', () => {
    // const email = faker.internet.email()
    // const user = {
    //     name: 'Graziele Almeida',
    //     email: 'galmeida@test.com',
    //     password: 'pwd123',
    //     is_provider: true
    // }

    before(function () {
        cy.fixture('signup').then((signup) => {
            this.success = signup.success
            this.email_invalido = signup.email_invalido
            this.short_password = signup.short_password   
        })
    })

    context('quando o usuario é novato', () => {
        it('deve cadastrar um novo usuario', function () {
            // interceptando a chamada da api para trocar o status code
            cy.intercept('POST', '/users', {
                statusCode: 200
            }).as('postUser') //criando um alias

            signupPage.go()
            signupPage.form(this.success)
            signupPage.submit()

            cy.wait('@postUser') // aguarda ate a api acontecer para trocar o status

            signupPage.toast.shouldHaveText('Agora você se tornou um(a) Samurai, faça seu login para ver seus agendamentos!')
        });

        it('deve cadastrar um novo usuario2', function () {
            cy.removeUser(this.success)
            signupPage.go()
            signupPage.form(this.success)
            signupPage.submit()
            signupPage.toast.shouldHaveText('Agora você se tornou um(a) Samurai, faça seu login para ver seus agendamentos!')
        });

    });

    context('quando o usuario ja exite', () => {
        it('nao deve cadastrar um usuario ja cadastrado', function() {
            cy.postUser(this.success)

            signupPage.go()
            signupPage.form(this.success)
            signupPage.submit()

            signupPage.toast.shouldHaveText('Email já cadastrado para outro usuário.')
        });

    });

    context('quando preenche o email incorreto', () => {
        it('deve exibir mensagem de alerta', function() {
            signupPage.go()
            signupPage.form(this.email_invalido)
            signupPage.submit()
            signupPage.alert.shouldHaveAlert('Informe um email válido')
        });
    });

    context('quando a senha é muito curta', () => {

        const passwords = ['1', '2a', 'ab3', 'abc4', 'ab#c5']

        beforeEach(() => {
            signupPage.go()
        });

        passwords.forEach((p) => {
            it('não deve cadastrar com a senha:' + p, function() {

                this.short_password.password = p

                signupPage.form(this.short_password)
                signupPage.submit()
            });
        })

        afterEach(() => {
            signupPage.alert.shouldHaveAlert('Pelo menos 6 caracteres')
        });

    });

    context('quando não preencho nenhum dos campos', () => {
        const alertMessages = [
            'Nome é obrigatório',
            'E-mail é obrigatório',
            'Senha é obrigatória'
        ]

        before(() => {
            signupPage.go()
            signupPage.submit()
        })

        alertMessages.forEach((alert) => {
            it('deve exibir ' + alert.toLowerCase(), () => {
                signupPage.alert.shouldHaveAlert(alert)
            });
        })
    });
});



