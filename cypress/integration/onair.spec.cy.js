it('deve acessar a pagina inicial', () => {
    cy.visit('/')

    cy.title()
        .should('eq', 'Samurai Barbershop by QAninja')
});