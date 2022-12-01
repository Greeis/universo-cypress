import { el } from './elements'

class Toast {

    shouldHaveText(expectText) {
        cy.get(el.toast, {timeout: 20000})
            .should('be.visible')
            .should('have.css', 'opacity', '1')
            .find('p')
            .should('have.text', expectText)
    }
}

export default new Toast()
