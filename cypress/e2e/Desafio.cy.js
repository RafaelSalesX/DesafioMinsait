// cypress/e2e/tests/desafio.cy.js
import { generateFakeData } from '../support/fakerData'; // Importa a função de geração de dados falsos

describe('Desafio 4 cenários de testes da página Home', () => {
  beforeEach(() => {
    cy.visit('https://www.toolsqa.com/selenium-training/#enroll-form');
  });

  it('1 - Deve preencher o formulário e verificar o alerta de sucesso', () => {
    // Chama a função para obter dados gerados pelo Faker
    const { firstName, lastName, email, phoneNumber, city, message, country } = generateFakeData();

    // Preenche o formulário com os dados aleatórios
    cy.get('#first-name').should('be.visible').type(firstName);
    cy.get('#last-name').should('be.visible').type(lastName);
    cy.get('#email').should('be.visible').type(email);
    cy.get('#mobile').should('be.visible').type(phoneNumber);
    cy.get('#country').should('be.visible').select(country); 
    cy.get('#city').should('be.visible').type(city);
    cy.get('#message').should('be.visible').type(message);

    // Pausa para preencher manualmente o CAPTCHA
    cy.pause(); // A execução vai parar aqui para que você possa preencher o CAPTCHA

    // Depois de preencher o CAPTCHA, o teste continuará
    cy.get('#enroll-form > .btn').click();

    // Espera que o alerta com a classe '.alert' apareça e valida o texto
    cy.get('.alert')
      .should('be.visible')
      .and('have.text', 'We have received your message. We will soon get in touch.');
  });


  it('2 - Valida a parte Selenium Certification Curriculum', () => {
    // Seleciona todos os botões de expandir dentro do container .curriculum
    cy.get('.curriculum .curriculum__card--expand-row > .curriculum__card--expand')
      .each(($elemento) => {
        // Clica em cada botão de expandir individualmente
        cy.wrap($elemento).click(); 
        cy.wait(1000); // Delay opcional de 1 segundo, ajuste conforme necessário
        
        // Verifica se o próximo elemento (conteúdo expandido) está visível
        cy.wrap($elemento).parent().next().should('be.visible').and('have.css', 'height').and('not.equal', '0px');  // Verifica se a altura não é zero
  
        // Caso necessário, aplicar uma espera adicional para garantir a visibilidade completa após o click 
        cy.wrap($elemento).parent().next().should('be.visible');
      });
  });
  


  it('3 - Valida os redirecionamentos dos blocos no menu HOME', () => {
    // Array com os seletores e as URLs esperadas para os redirecionamentos
    const blocos = [
      { selector: '[href="https://www.toolsqa.com/testrigor/testrigor-tutorial"]', expectedUrl: 'https://www.toolsqa.com/testrigor/testrigor-tutorial' },
      { selector: '.col-12 > [href="/katalon-studio-tutorial"]', expectedUrl: 'https://www.toolsqa.com/katalon-studio-tutorial' },
      { selector: '.col-12 > [href="/software-testing/istqb-foundation-level/"]', expectedUrl: 'https://www.toolsqa.com/software-testing/istqb-foundation-level/' },
      { selector: '.col-12 > [href="/agile/agile-scrum-tutorial/"]', expectedUrl: 'https://www.toolsqa.com/agile/agile-scrum-tutorial/' },
      { selector: '.col-12 > [href="/git/git-tutorial/"]', expectedUrl: 'https://www.toolsqa.com/git/git-tutorial/' },
      { selector: '.col-12 > [href="/protractor-tutorial/"]', expectedUrl: 'https://www.toolsqa.com/protractor-tutorial/' },
      { selector: '.col-12 > [href="/selenium-webdriver/selenium-tutorial/"]', expectedUrl: 'https://www.toolsqa.com/selenium-webdriver/selenium-tutorial/' },
      { selector: '.col-12 > [href="/rest-assured-tutorial/"]', expectedUrl: 'https://www.toolsqa.com/rest-assured-tutorial/' },
      { selector: '[href="https://www.toolsqa.com/postman/postman-tutorial/"]', expectedUrl: 'https://www.toolsqa.com/postman/postman-tutorial/' },
      { selector: '[href="https://www.toolsqa.com/cucumber-tutorial/"]', expectedUrl: 'https://www.toolsqa.com/cucumber-tutorial/' }
    ];

    // Clique no menu HOME e valida a URL
    cy.get('.navbar__links > :nth-child(1) > a')
      .should('have.text', 'Home') // Valida que o texto é 'HOME'
      .click();

    // Para cada bloco, valida o redirecionamento
    blocos.forEach(bloco => {
      cy.get(bloco.selector)
        .should('be.visible') // Garante que o link está visível
        .click(); // Clica no link
      cy.url().should('eq', bloco.expectedUrl); // Verifica a URL esperada
      cy.go('back'); // Volta para a página inicial
    });
  });

  it('4 - Valida o funcionamento do carrossel e o redirecionamento das imagens', () => {
    // Clica no link da Home para garantir que estamos na página inicial
    cy.get('.navbar__links > :nth-child(1) > a')
      .click()
      .should('have.text', 'Home'); // Verifica que o texto do link é 'Home'
    
    // Valida a presença do carrossel
    cy.get('.latest-articles-and-popular-articles > .container-fluid').should('be.visible');
  
    // Lista com os itens do carrossel, usando os IDs de cada imagem
    const imagens = [
      '#tns1-item1 > .article__featured-image',
      '#tns1-item2 > .article__featured-image',
      '#tns1-item3 > .article__featured-image',
      '#tns1-item4 > .article__featured-image',
      '#tns1-item5 > .article__featured-image',
    ];
  
    // Função para verificar as imagens no carrossel
    imagens.forEach((imagemSelector) => {
      // Clica em cada imagem do carrossel
      cy.get(imagemSelector)
        .should('be.visible') // Valida que a imagem está visível
        .click(); // Simula o clique na imagem
  
      // Validação de mudança de página: verifica se um elemento específico da nova página está visível
      cy.get('h1')  // Por exemplo, o título da página pode ser um <h1>, ajuste conforme necessário
        .should('be.visible'); // Valida que o título da nova página está visível, indicando que houve um redirecionamento
  
      cy.go('back'); // Volta para a página inicial
  
      // Espera um pouco antes de prosseguir para o próximo
      cy.wait(1000);
    });
  
    // Navega pelas imagens usando os botões Next e Prev
    cy.get('[data-controls="next"]').click(); 
    cy.wait(1000); // Espera a transição
    cy.get('[data-controls="next"]').click(); 
    cy.wait(1000); // Espera a transição
  
    // Volta para a imagem anterior
    cy.get('[data-controls="prev"]').click();
    cy.wait(1000); // Espera a transição
  });

});
