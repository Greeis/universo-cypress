import { el } from './elements'

class Alert {

    shouldHaveAlert(expectTest) {
        cy.contains(el.error, expectTest)
            .should('be.visible')
    }
}

export default new Alert()
