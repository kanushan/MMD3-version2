<template>
  <footer class="footer">
    <!-- Main Footer Content -->
    <div class="footer-main">
      <div class="footer-container">
        <!-- Åbningstider -->
        <div class="footer-section">
          <h3 class="footer-heading">Åbningstider:</h3>
          <ul class="footer-list">
            <li><span class="day">Man-tors kl:</span> 10.00 - 18.00</li>
            <li><span class="day">Fredag kl:</span> 10.00 - 19.00</li>
            <li><span class="day">Lørdag kl:</span> 10.00 - 16.00</li>
            <li>
              <span class="day">Første søndag i måneden kl:</span> 11.00 - 15.00
            </li>
          </ul>
        </div>

        <!-- Information -->
        <div class="footer-section">
          <h3 class="footer-heading">Information:</h3>
          <ul class="footer-list footer-links">
            <li>
              <NuxtLink to="/handelsbetingelser">Handelsbetingelser</NuxtLink>
            </li>
            <li><NuxtLink to="/returnering">Returnering</NuxtLink></li>
            <li><NuxtLink to="/fragtpriser">Fragtpriser</NuxtLink></li>
            <li><NuxtLink to="/stoerrelsesguide">Størrelsesguide</NuxtLink></li>
            <li>
              <NuxtLink to="/privatlivspolitik">Privatlivspolitik</NuxtLink>
            </li>
            <li><NuxtLink to="/cookiepolitik">Cookiepolitik</NuxtLink></li>
          </ul>
        </div>

        <!-- Før dit køb -->
        <div class="footer-section">
          <h3 class="footer-heading">Før dit køb</h3>
          <ul class="footer-list">
            <li>Gratis fragt over 599,-</li>
            <li>Billig fragt 29,-</li>
            <li>Dag til dag levering</li>
            <li>Track n' Trace</li>
          </ul>
        </div>

        <!-- Kontakt -->
        <div class="footer-section">
          <h3 class="footer-heading">Kontakt</h3>
          <ul class="footer-list contact-list">
            <li>Boxen</li>
            <li>Nytorv 1</li>
            <li>
              <a href="mailto:boxen9000@gmail.com">boxen9000@gmail.com</a>
            </li>
            <li>DK-9000 Aalborg</li>
            <li>Tlf.: <a href="tel:+4598169166">+45 98 16 91 66</a></li>
          </ul>
        </div>

        <!-- Følg os -->
        <div class="footer-section footer-social">
          <h3 class="footer-heading">Følg os</h3>
          <div class="social-icons">
            <a
              href="https://www.facebook.com/boxenaalborg?locale=da_DK"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              class="social-icon"
            >
              <img
                src="../public/img/footerImgs/Facebook.png"
                alt="Facebook"
                class="social-img"
              />
            </a>
            <a
              href="https://www.instagram.com/boxenaalborg/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              class="social-icon"
            >
              <img
                src="../public/img/footerImgs/Instagram.png"
                alt="Instagram"
                class="social-img"
              />
            </a>
          </div>
          <div class="trustpilot-wrapper">
            <a
              href="https://www.trustpilot.com/review/yourcompany"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Trustpilot"
            >
              <img
                src="../public/img/footerImgs/TrustPilot.png"
                alt="Trustpilot"
                class="trustpilot-img"
              />
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Delivery & Payment Logos Bar -->
    <div class="footer-logos">
      <div class="footer-container logos-container">
        <div class="delivery-logos">
          <img
            src="../public/img/footerImgs/PostNord.png"
            alt="PostNord"
            class="delivery-logo"
          />
          <img
            src="../public/img/footerImgs/GLS.png"
            alt="GLS"
            class="delivery-logo"
          />
        </div>
        <div class="payment-logos">
          <img
            src="../public/img/footerImgs/PaymentMethods.png"
            alt="Betalingsmetoder - MobilePay, ViaBill, PayPal, Dankort, Visa, Mastercard, Amex, JCB, Maestro"
            class="payment-img"
          />
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="footer-bottom">
      <div class="footer-container">
        <p class="cvr">CVR: 26992192</p>
        <p class="copyright">Copyright @ 2025 Boxen</p>
      </div>
    </div>
  </footer>
</template>

<script setup></script>

<style scoped>
.footer {
  background-color: #212121;
  color: #ffffff;
  padding-top: 1rem;
}


.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.footer-main {
  padding: 3rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-main .footer-container {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 2rem;
}

.footer-heading {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #ffffff;
}

.footer-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-list li {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

.footer-list .day {
  color: #ffffff;
  font-weight: 500;
}

/* Links */
.footer-links a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: color 0.2s ease;
}

.footer-links a:hover {
  color: #ffffff;
}

.contact-list a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: color 0.2s ease;
}

.contact-list a:hover {
  color: #ffffff;
  text-decoration: underline;
}

/* Social Icons */
.social-icons {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s ease;
}

.social-icon:hover {
  opacity: 0.8;
}

.social-img {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

/* Trustpilot */
.trustpilot-wrapper {
  margin-top: 0.5rem;
}

.trustpilot-img {
  max-width: 120px;
  height: auto;
}

/* Logos Bar */
.footer-logos {
  padding: 1.5rem 0;
  background-color: #212121;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logos-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.delivery-logos {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.delivery-logo {
  height: 24px;
  width: auto;
  object-fit: contain;
}

.payment-logos {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.payment-img {
  height: 24px;
  width: auto;
  object-fit: contain;
}

/* Bottom Bar */
.footer-bottom {
  padding: 1.5rem 0;
  text-align: center;
}

.footer-bottom .footer-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.cvr,
.copyright {
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

/* Responsive */
@media (max-width: 1024px) {
  .footer-main .footer-container {
    grid-template-columns: repeat(3, 1fr);
  }

  .footer-social {
    grid-column: span 1;
  }
}

@media (max-width: 768px) {
  .footer-main .footer-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem 1.5rem;
  }

  .logos-container {
    flex-direction: column;
    gap: 1.5rem;
  }

  .payment-logos {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .footer-main .footer-container {
    grid-template-columns: 1fr;
  }

  .footer-section {
    text-align: center;
  }

  .social-icons {
    justify-content: center;
  }

  .trustpilot-wrapper {
    display: flex;
    justify-content: center;
  }
}
</style>
