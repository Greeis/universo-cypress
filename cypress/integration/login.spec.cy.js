import loginPage from '../support/pages/login'
import dashPage from '../support/pages/dash'

describe('login', () => {

    context('quando o usuario for valido', () => {
        const user = {
            name: 'Graziele Almeida',
            email: 'graziele-test@test.com',
            password: '123456',
            is_provider: true
        }

        before(() => {
            cy.postUser(user)
        })

        it('deve logar com sucesso', () => {
            loginPage.go()
            loginPage.form(user)
            loginPage.submit()

            dashPage.header.shouldHaveText(user.name)

        });
    });

    context('quando o usuario informa a senha invalida', () => {
        let userInvalido = {
            name: 'Graziele Almeida',
            email: 'galmeida@test.com',
            password: 'pwd123',
            is_provider: true
        }

        before(() => {
            cy.postUser(userInvalido).then(() => {
                // aguarda o callback para executar 
                // evita que o js execute tudo de um vez só
                userInvalido.password = 'abc123'
            })
        })

        it('deve notificar erro de credenciais', () => {
            loginPage.go()
            loginPage.form(userInvalido)
            loginPage.submit()
            
            const message = 'Ocorreu um erro ao fazer login, verifique suas credenciais.'

            loginPage.toast.shouldHaveText(message)
        });
    });

    context('quando o formato do email é invalido', () => {
        const emails = [
            'galmeida.com.br',
            'yahoo.com',
            '@gmail.com',
            '@',
            'galmeida@',
            '111',
            'xpto123',
            '&*^&*^&*^'
        ]

        before(() => {
            loginPage.go()
        });

        emails.forEach(email => {
            it('não deve logar com o email: ' + email, () => {
                const user = { email: email, password: 'pwd123' }
                
                loginPage.form(user)
                loginPage.submit()

                loginPage.alert.shouldHaveAlert('Informe um email válido')
            });
            
        });
    });

    context('quando não preencho nenhum dos campos', () => {
        const alertMessages = [
            'E-mail é obrigatório',
            'Senha é obrigatória'
        ]

        before(() => {
            loginPage.go()
            loginPage.submit()
        })

        alertMessages.forEach((alert) => {
            it('deve exibir ' + alert.toLowerCase(), () => {
                loginPage.alert.shouldHaveAlert(alert)
            });
        })
    });
});