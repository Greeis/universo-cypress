
import fpPage from '../support/pages/forgetpass'
import rpPage from '../support/pages/resetpass'

describe('recuperar senha', () => {

    before(function(){
        cy.fixture('recovery').then(function(recovery) {
            this.data = recovery
        })
    });

    context('quando o usuário esquece a senha', () => {
        before(function() {
            cy.postUser(this.data)
        })

        it('deve poder resgatar por email', function() {
            fpPage.go()
            fpPage.form(this.data.email)
            fpPage.submit()
            const message = 'Enviamos um e-mail para confirmar a recuperação de senha, cheque sua caixa de entrada.'

            fpPage.toast.shouldHaveText(message)
        });
    });

    context('quando o usuário solicita a recuperacao de senha', () => {
        before(function() {
            cy.postUser(this.data)
            cy.recoveryPass(this.data.email)
        })

        it('deve poder cadastrar uma nova senha', function() {
            rpPage.go(Cypress.env('recoveryToken'))
            rpPage.form('123456', '123456')
            rpPage.submit()

            const message = 'Agora você já pode logar com a sua nova senha secreta.'

            rpPage.toast.shouldHaveText(message)
        });
    });
});
