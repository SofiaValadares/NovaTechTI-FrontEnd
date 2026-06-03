import React from 'react';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <section className="footer-section">
          <h2>Contatos</h2>
          <ul>
            <li>
              Telefone fixo:{' '}
              <a href="tel:+551130000000">(11) 3000-0000</a>
            </li>
            <li>
              WhatsApp:{' '}
              <a
                href="https://wa.me/5511999998888"
                target="_blank"
                rel="noreferrer"
              >
                (11) 99999-8888
              </a>
            </li>
            <li>
              Email:{' '}
              <a href="mailto:contato@novatech.com">contato@novatech.com</a>
            </li>
          </ul>
        </section>
        <section className="footer-section">
          <h2>Endereço</h2>
          <p>
            Rua da Tecnologia, 123, Sala 45
            <br />
            Centro, São Paulo - SP
            <br />
            CEP 01000-000
          </p>
        </section>
        <section className="footer-section">
          <h2>Formas de pagamento</h2>
          <ul className="payment-methods">
            <li>
              <span className="material-icons">credit_card</span> Visa
            </li>
            <li>
              <span className="material-icons">credit_card</span> Mastercard
            </li>
            <li>
              <span className="material-icons">credit_card</span> Elo
            </li>
            <li>
              <span className="material-icons">credit_card</span> American
              Express
            </li>
            <li>
              <span className="material-icons">qr_code_2</span> Pix:{' '}
              <a href="mailto:novatech@pix.com.br">novatech@pix.com.br</a>
            </li>
            <li>
              <span className="material-icons">receipt_long</span> Boleto
              bancário
            </li>
          </ul>
        </section>
      </div>
    </footer>
  );
}
