(() => {
  "use strict";

  const translations = {
    en: {
      link: "Support the lab", title: "Enjoying the puzzles?", intro: "Enjoyed playing? An optional tip says thanks for the puzzles you've played and helps keep the lab free.",
      completion: "Enjoyed this puzzle?", completionNote: "A little support helps keep the puzzles free.",
      crypto: "Tip with crypto", network: "Network", token: "Currency", amount: "Suggested amount", other: "Other amount",
      address: "Receiving address", copyAddress: "Copy address", copied: "Address copied", copyFailed: "Select and copy the address below.",
      qr: "Receiving address QR code", qrNote: "Scan the address, then enter your tip amount in your wallet.",
      warning: "Send only {token} on {network}. Choose this network in your wallet before transferring.",
      note: "Tip any amount you like. No account needed. Your wallet shows the transfer status.",
      close: "Close", thanks: "Thank you for supporting the lab.", unavailable: "Support will be available soon.", card: "Leave a tip by card", cardNote: "US$1 per unit. Change the quantity at checkout to choose your tip. One-time payment.", or: "or"
    },
    de: {
      link: "Das Projekt unterstützen", title: "Machen dir die Rätsel Spaß?", intro: "Mit einem freiwilligen Trinkgeld kannst du dich für die gespielten Rätsel bedanken und helfen, Daily Logic Lab kostenlos zu halten.",
      completion: "Hat dir das Rätsel gefallen?", completionNote: "Mit deiner Unterstützung bleiben die Rätsel kostenlos.",
      crypto: "Trinkgeld mit Kryptowährung", network: "Netzwerk", token: "Währung", amount: "Betragsvorschlag", other: "Anderer Betrag",
      address: "Empfängeradresse", copyAddress: "Adresse kopieren", copied: "Adresse kopiert", copyFailed: "Bitte markiere und kopiere die Adresse unten.",
      qr: "QR-Code der Empfängeradresse", qrNote: "Scanne die Adresse und gib den Betrag in deiner Wallet ein.",
      warning: "Sende ausschließlich {token} über {network}. Wähle vor der Überweisung dieses Netzwerk in deiner Wallet.",
      note: "Du bestimmst den Betrag. Kein Konto nötig. Den Status siehst du in deiner Wallet.",
      close: "Schließen", thanks: "Danke für deine Unterstützung.", unavailable: "Unterstützung ist bald möglich.", card: "Trinkgeld mit Karte", cardNote: "1 US-Dollar pro Einheit. Passe beim Bezahlen die Anzahl an, um den Betrag festzulegen. Einmalige Zahlung.", or: "oder"
    },
    es: {
      link: "Apoya el proyecto", title: "¿Te gustan los rompecabezas?", intro: "Si has disfrutado de los puzzles, puedes dejar una propina voluntaria como agradecimiento y ayudarnos a mantenerlos gratuitos.",
      completion: "¿Has disfrutado del reto?", completionNote: "Tu apoyo nos ayuda a seguir ofreciendo puzzles gratis.",
      crypto: "Propina con criptomonedas", network: "Red", token: "Moneda", amount: "Importe sugerido", other: "Otro importe",
      address: "Dirección de recepción", copyAddress: "Copiar dirección", copied: "Dirección copiada", copyFailed: "Selecciona y copia la dirección de abajo.",
      qr: "Código QR de la dirección de recepción", qrNote: "Escanea la dirección e introduce el importe en tu monedero.",
      warning: "Envía solo {token} por {network}. Selecciona esta red en tu monedero antes de transferir.",
      note: "Elige el importe de tu propina. No necesitas cuenta. Consulta el estado en tu monedero.",
      close: "Cerrar", thanks: "Gracias por apoyar el proyecto.", unavailable: "Pronto podrás apoyar el proyecto.", card: "Dejar propina con tarjeta", cardNote: "1 USD por unidad. Cambia la cantidad al pagar para elegir el importe de la propina. Pago único.", or: "o"
    },
    fr: {
      link: "Soutenir le projet", title: "Vous aimez ces puzzles ?", intro: "Si vous avez aimé jouer, un pourboire facultatif permet de nous remercier pour les puzzles et de les garder gratuits.",
      completion: "Ce puzzle vous a plu ?", completionNote: "Votre soutien nous aide à garder les puzzles gratuits.",
      crypto: "Pourboire en crypto", network: "Réseau", token: "Devise", amount: "Montant suggéré", other: "Autre montant",
      address: "Adresse de réception", copyAddress: "Copier l’adresse", copied: "Adresse copiée", copyFailed: "Sélectionnez et copiez l’adresse ci-dessous.",
      qr: "QR code de l’adresse de réception", qrNote: "Scannez l’adresse, puis saisissez le montant dans votre portefeuille.",
      warning: "Envoyez uniquement des {token} via {network}. Sélectionnez ce réseau dans votre portefeuille avant le transfert.",
      note: "Le montant est libre. Aucun compte nécessaire. Le statut du transfert apparaît dans votre portefeuille.",
      close: "Fermer", thanks: "Merci de soutenir le projet.", unavailable: "Le soutien sera bientôt disponible.", card: "Laisser un pourboire par carte", cardNote: "1 USD par unité. Modifiez la quantité lors du paiement pour choisir le montant. Paiement unique.", or: "ou"
    },
    ja: {
      link: "サイトを応援", title: "パズルを楽しんでいますか？", intro: "遊んだパズルを気に入っていただけたら、チップで応援していただけるとうれしいです。お支払いは任意で、パズルは引き続き無料です。",
      completion: "このパズルはいかがでしたか？", completionNote: "皆さまの応援が、無料のパズルを支えています。",
      crypto: "暗号資産で応援", network: "ネットワーク", token: "通貨", amount: "金額の目安", other: "その他の金額",
      address: "送金先アドレス", copyAddress: "アドレスをコピー", copied: "アドレスをコピーしました", copyFailed: "下のアドレスを選択してコピーしてください。",
      qr: "送金先アドレスのQRコード", qrNote: "アドレスを読み取り、ウォレットで金額を入力してください。",
      warning: "{network}ネットワークの{token}のみお送りください。送金前にウォレットのネットワークを確認してください。",
      note: "金額は自由です。アカウントは不要です。送金状況はウォレットでご確認ください。",
      close: "閉じる", thanks: "応援ありがとうございます。", unavailable: "応援の受付は近日開始予定です。", card: "カードでチップを送る", cardNote: "1口1米ドルです。決済画面で数量を変更して金額をお選びください。お支払いは今回限りです。", or: "または"
    },
    "pt-br": {
      link: "Apoie o projeto", title: "Está curtindo os puzzles?", intro: "Gostou de jogar? Uma gorjeta opcional é uma forma de agradecer pelos puzzles que você jogou e ajudar a mantê-los gratuitos.",
      completion: "Gostou deste desafio?", completionNote: "Seu apoio ajuda a manter os puzzles gratuitos.",
      crypto: "Gorjeta com criptomoedas", network: "Rede", token: "Moeda", amount: "Valor sugerido", other: "Outro valor",
      address: "Endereço para receber", copyAddress: "Copiar endereço", copied: "Endereço copiado", copyFailed: "Selecione e copie o endereço abaixo.",
      qr: "QR code do endereço para receber", qrNote: "Escaneie o endereço e informe o valor na sua carteira.",
      warning: "Envie apenas {token} pela rede {network}. Selecione essa rede na sua carteira antes de transferir.",
      note: "Escolha o valor da gorjeta. Não precisa de conta. Veja o status na sua carteira.",
      close: "Fechar", thanks: "Obrigado por apoiar o projeto.", unavailable: "Em breve você poderá apoiar o projeto.", card: "Dar gorjeta com cartão", cardNote: "US$1 por unidade. Altere a quantidade no checkout para escolher o valor. Pagamento único.", or: "ou"
    },
    "zh-cn": {
      link: "支持本站", title: "喜欢这里的谜题吗？", intro: "如果玩得开心，可以为已经体验的谜题留一份打赏。完全自愿，谜题继续免费。",
      completion: "这道题玩得开心吗？", completionNote: "你的支持，让免费谜题继续更新。",
      crypto: "加密货币打赏", network: "转账网络", token: "币种", amount: "建议打赏金额", other: "自定义金额",
      address: "收款地址", copyAddress: "复制地址", copied: "地址已复制", copyFailed: "请选中下方地址并手动复制。",
      qr: "收款地址二维码", qrNote: "扫码获取收款地址后，请在钱包中填写打赏金额。",
      warning: "请仅通过 {network} 网络转入 {token}。转账前，请在钱包中核对所选网络。",
      note: "金额随心，无需登录。转账状态请在你的钱包中查看。",
      close: "关闭", thanks: "谢谢你支持 Daily Logic Lab。", unavailable: "打赏入口即将开放。", card: "银行卡打赏", cardNote: "每份 1 美元，在付款页修改数量即可选择打赏金额。仅支付一次。", or: "或"
    }
  };

  const language = document.documentElement.lang.toLowerCase();
  const cardAmounts = {
    en: ["Tip amount (USD)", "Custom amount (USD)", "Choose a whole-dollar amount from US$1 to US$1,000. One-time payment.", "Opening payment page…", "Could not open the payment page. Please try again.", "Enter a whole-dollar amount between 1 and 1000."],
    de: ["Trinkgeld (USD)", "Eigener Betrag (USD)", "Wähle einen Betrag von 1 bis 1.000 US-Dollar ohne Nachkommastellen. Einmalige Zahlung.", "Zahlungsseite wird geöffnet…", "Die Zahlungsseite konnte nicht geöffnet werden. Bitte versuche es erneut.", "Gib einen ganzen Betrag zwischen 1 und 1000 ein."],
    es: ["Importe de la propina (USD)", "Importe personalizado (USD)", "Elige un importe entero entre 1 y 1000 dólares estadounidenses. Pago único.", "Abriendo la página de pago…", "No se pudo abrir la página de pago. Inténtalo de nuevo.", "Introduce un importe entero entre 1 y 1000."],
    fr: ["Montant du pourboire (USD)", "Montant personnalisé (USD)", "Choisissez un montant entier entre 1 et 1 000 dollars américains. Paiement unique.", "Ouverture de la page de paiement…", "Impossible d’ouvrir la page de paiement. Veuillez réessayer.", "Saisissez un montant entier entre 1 et 1000."],
    ja: ["チップの金額（米ドル）", "金額を入力（米ドル）", "1〜1,000米ドルの整数でお選びください。お支払いは今回限りです。", "決済画面を開いています…", "決済画面を開けませんでした。もう一度お試しください。", "1〜1,000の整数を入力してください。"],
    "pt-br": ["Valor da gorjeta (USD)", "Valor personalizado (USD)", "Escolha um valor inteiro entre US$1 e US$1.000. Pagamento único.", "Abrindo a página de pagamento…", "Não foi possível abrir a página de pagamento. Tente novamente.", "Digite um valor inteiro entre 1 e 1000."],
    "zh-cn": ["银行卡打赏金额（美元）", "自定义金额（美元）", "支持 1–1000 美元的整数金额，仅支付一次。", "正在打开付款页…", "暂时无法打开付款页，请重试。", "请输入 1–1000 之间的整数金额。"]
  };
  const copy = translations[language] || translations.en;
  const [cardAmountLabel, customCardAmount, cardAmountNote, cardLoading, cardFailed, cardInvalid] = cardAmounts[language] || cardAmounts.en;
  const config = window.DailyLogicSupportConfig || {};
  const networks = (config.networks || []).filter((item) => item.id && item.name && item.address && Array.isArray(item.tokens) && item.tokens.length);
  let selectedNetwork = networks[0];
  let selectedToken = selectedNetwork?.tokens[0];
  let entryPoint = "footer";
  let qrPromise;
  let qrRevision = 0;
  let opener;

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function button(text, className, action) {
    const node = element("button", className, text);
    node.type = "button";
    if (action) node.addEventListener("click", action);
    return node;
  }

  function track(name, extra = {}, afterEvent) {
    // Interactions measure intent. Only Stripe can confirm a card payment.
    if (!window.DailyLogicAnalytics?.enabled || typeof window.gtag !== "function") {
      afterEvent?.();
      return;
    }
    const cryptoEvent = ["donation_address_copy", "donation_network_select", "donation_token_select"].includes(name);
    try {
      window.gtag("event", name, {
        language, entry_point: entryPoint,
        ...(cryptoEvent ? { payment_method: "crypto", chain: selectedNetwork?.id || "", token: selectedToken || "" } : {}),
        ...extra,
        ...(afterEvent ? { event_callback: afterEvent, event_timeout: 1200 } : {})
      });
    } catch { afterEvent?.(); }
  }

  async function paymentAnalyticsContext() {
    if (!window.DailyLogicAnalytics?.enabled || typeof window.gtag !== "function" || !/^G-[A-Z0-9]+$/.test(config.ga4MeasurementId || "")) return {};
    const read = (field) => new Promise((resolve) => {
      const timer = setTimeout(() => resolve(undefined), 800);
      try {
        window.gtag("get", config.ga4MeasurementId, field, (value) => { clearTimeout(timer); resolve(value); });
      } catch { clearTimeout(timer); resolve(undefined); }
    });
    const [clientId, sessionId] = await Promise.all([read("client_id"), read("session_id")]);
    return { clientId, sessionId };
  }

  const dialog = element("dialog", "support-dialog");
  dialog.id = "supportDialog";
  dialog.setAttribute("aria-labelledby", "supportTitle");
  dialog.setAttribute("aria-describedby", "supportIntro");
  const content = element("div", "support-dialog-content");
  const close = button("×", "support-close", () => dialog.close());
  close.setAttribute("aria-label", copy.close);
  const icon = element("span", "support-heart");
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = "♡";
  const title = element("h2", "", copy.title);
  title.id = "supportTitle";
  const intro = element("p", "support-intro", copy.intro);
  intro.id = "supportIntro";
  content.append(close, icon, title, intro);
  const methods = element("div", "support-methods");
  const card = element("section", "support-method support-bank-card");
  card.setAttribute("aria-labelledby", "supportCardTitle");
  const cardTitle = element("h3", "support-method-title", copy.card);
  cardTitle.id = "supportCardTitle";
  card.append(cardTitle);
  methods.append(card);
  content.append(methods);

  // The server creates Checkout Sessions. Card details stay on Stripe.
  if (config.stripeCheckoutEnabled) {
    const form = element("form", "support-card-form");
    const field = element("fieldset", "support-field support-card-amount");
    field.append(element("legend", "", cardAmountLabel));
    const options = element("div", "support-choices support-amount-choices");
    const input = element("input", "support-amount-input");
    input.id = "supportCardAmount";
    input.name = "amount";
    input.type = "number";
    input.min = "1";
    input.max = "1000";
    input.step = "1";
    input.required = true;
    input.inputMode = "numeric";
    input.value = "5";
    input.setAttribute("aria-describedby", "supportCardHelp");
    const inputLabel = element("label", "support-custom-label", customCardAmount);
    inputLabel.htmlFor = input.id;
    const help = element("p", "support-card-note", cardAmountNote);
    help.id = "supportCardHelp";
    const stripe = button(copy.card, "support-card primary");
    stripe.type = "submit";
    const cardStatus = element("p", "support-card-status");
    cardStatus.setAttribute("role", "status");
    cardStatus.setAttribute("aria-live", "polite");
    let requestId;
    let busy = false;
    function updateAmount() {
      const value = input.valueAsNumber;
      const valid = Number.isInteger(value) && value >= 1 && value <= 1000;
      input.setCustomValidity(valid ? "" : cardInvalid);
      for (const choice of options.querySelectorAll("button")) choice.setAttribute("aria-pressed", String(valid && Number(choice.dataset.amount) === value));
      stripe.textContent = valid ? `${copy.card} · US$${value}` : copy.card;
      cardStatus.textContent = "";
      requestId = undefined;
    }
    for (const amount of [1, 3, 5, 10, 20]) {
      const choice = button(`$${amount}`, "support-choice", () => {
        input.value = String(amount);
        updateAmount();
        track("donation_amount_select", { payment_method: "card", amount_usd: amount, amount_source: "preset" });
      });
      choice.dataset.amount = String(amount);
      options.append(choice);
    }
    input.addEventListener("input", updateAmount);
    input.addEventListener("change", () => {
      if (input.validity.valid) track("donation_amount_select", { payment_method: "card", amount_usd: input.valueAsNumber, amount_source: "custom" });
    });
    field.append(options);
    form.append(field, inputLabel, input, help, stripe, cardStatus);
    updateAmount();
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (busy || !form.reportValidity()) return;
      busy = true;
      const amount = input.valueAsNumber;
      const buttonText = stripe.textContent;
      stripe.disabled = true;
      input.disabled = true;
      for (const choice of options.querySelectorAll("button")) choice.disabled = true;
      stripe.textContent = cardLoading;
      cardStatus.textContent = "";
      let errorStage = "checkout_request";
      track("donation_checkout_start", { payment_method: "card", amount_usd: amount });
      try {
        requestId ||= window.crypto.randomUUID();
        const analytics = await paymentAnalyticsContext();
        const response = await fetch("/api/support/checkout", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount, language, returnPath: location.pathname, requestId, analytics, entryPoint }),
          signal: AbortSignal.timeout(50000)
        });
        const result = await response.json();
        if (!response.ok) throw new Error("Checkout unavailable");
        errorStage = "checkout_response";
        const checkoutUrl = new URL(result.url);
        if (checkoutUrl.protocol !== "https:" || checkoutUrl.hostname !== "checkout.stripe.com" || checkoutUrl.username || checkoutUrl.password) throw new Error("Invalid checkout URL");
        track("donation_card_click", { payment_method: "card", amount_usd: amount });
        // Give the tag a bounded chance to process the event before navigation.
        // Ad blockers or a slow analytics script must never block payment.
        await new Promise((resolve) => {
          const timer = setTimeout(resolve, 1500);
          track("begin_checkout", {
            payment_method: "card", currency: "USD", value: amount,
            items: [{ item_id: "dailylogiclab_content_tip", item_name: "Daily Logic Lab puzzle content tip", price: 1, quantity: amount }]
          }, () => { clearTimeout(timer); resolve(); });
        });
        location.assign(checkoutUrl.href);
      } catch {
        track("donation_checkout_error", { payment_method: "card", amount_usd: amount, error_stage: errorStage });
        cardStatus.textContent = cardFailed;
      } finally {
        busy = false;
        stripe.disabled = false;
        input.disabled = false;
        for (const choice of options.querySelectorAll("button")) choice.disabled = false;
        stripe.textContent = buttonText;
      }
    });
    card.append(form);
  } else if (config.stripeUrl) {
    try {
      const url = new URL(config.stripeUrl);
      if (url.protocol === "https:" && ["buy.stripe.com", "donate.stripe.com"].includes(url.hostname) && !url.username && !url.password) {
        const stripe = element("a", "support-card primary", copy.card);
        url.searchParams.set("locale", {"zh-cn": "zh", "pt-br": "pt-BR"}[language] || language);
        stripe.href = url.href;
        stripe.target = "_blank";
        stripe.rel = "noopener noreferrer";
        stripe.addEventListener("click", () => track("donation_card_click", { payment_method: "card" }));
        card.append(stripe, element("p", "support-card-note", copy.cardNote));
      }
    } catch { /* Keep an invalid card configuration out of the payment UI. */ }
  }

  if (card.children.length === 1) card.hidden = true;
  const crypto = element("section", "support-method support-crypto");
  crypto.setAttribute("aria-labelledby", "supportCryptoTitle");
  const cryptoTitle = element("h3", "support-method-title", copy.crypto);
  cryptoTitle.id = "supportCryptoTitle";
  crypto.append(cryptoTitle);
  function choices(label, name) {
    const fieldset = element("fieldset", "support-field");
    fieldset.append(element("legend", "", label));
    const group = element("div", "support-choices");
    group.dataset.supportChoices = name;
    fieldset.append(group);
    crypto.append(fieldset);
    return group;
  }
  const networkChoices = choices(copy.network, "network");
  const tokenChoices = choices(copy.token, "token");
  const warning = element("p", "support-network-note");
  warning.id = "supportNetworkNote";
  crypto.append(warning);
  const wallet = element("div", "support-wallet");
  const qr = element("div", "support-qr");
  qr.setAttribute("role", "img");
  qr.setAttribute("aria-label", copy.qr);
  const addressLabel = element("label", "support-address-label", copy.address);
  const address = element("textarea", "support-address");
  address.id = "supportAddress";
  address.readOnly = true;
  address.rows = 2;
  address.spellcheck = false;
  address.setAttribute("aria-describedby", warning.id);
  addressLabel.htmlFor = address.id;
  const status = element("p", "support-status");
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  const copyButton = button(copy.copyAddress, "support-copy primary", async () => {
    const expectedAddress = address.value;
    status.textContent = "";
    try {
      await navigator.clipboard.writeText(expectedAddress);
      if (address.value !== expectedAddress) return;
      status.textContent = copy.copied;
      track("donation_address_copy");
    } catch {
      address.focus();
      address.select();
      status.textContent = copy.copyFailed;
    }
  });
  wallet.append(qr, addressLabel, address, copyButton, status, element("p", "support-qr-note", copy.qrNote));
  const suggestedAmount = element("p", "support-suggested");
  crypto.append(wallet, suggestedAmount, element("p", "support-note", copy.note));
  methods.append(crypto);
  if (!networks.length) {
    crypto.hidden = true;
    content.append(element("p", "support-note", copy.unavailable));
  }

  content.append(element("p", "support-thanks", copy.thanks));
  dialog.append(content);
  document.body.append(dialog);

  function loadQrLibrary() {
    if (typeof window.qrcode === "function") return Promise.resolve(window.qrcode);
    if (!qrPromise) {
      qrPromise = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "/vendor/qrcode-generator-2.0.4.js";
        script.onload = () => typeof window.qrcode === "function" ? resolve(window.qrcode) : reject(new Error("QR unavailable"));
        script.onerror = () => { script.remove(); reject(new Error("QR unavailable")); };
        document.head.append(script);
      }).catch((error) => { qrPromise = undefined; throw error; });
    }
    return qrPromise;
  }

  async function renderQr() {
    const revision = ++qrRevision;
    const walletAddress = selectedNetwork.address;
    qr.replaceChildren();
    qr.hidden = false;
    qr.classList.add("is-loading");
    try {
      const makeQr = await loadQrLibrary();
      if (revision !== qrRevision) return;
      const code = makeQr(0, "M");
      code.addData(walletAddress);
      code.make();
      qr.innerHTML = code.createSvgTag({ cellSize: 4, margin: 16, scalable: true });
      qr.classList.remove("is-loading");
    } catch {
      if (revision === qrRevision) qr.hidden = true;
    }
  }

  function renderPayment() {
    if (!selectedNetwork) return;
    networkChoices.replaceChildren(...networks.map((network) => {
      const node = button(network.name, "support-choice", () => {
        selectedNetwork = network;
        if (!network.tokens.includes(selectedToken)) selectedToken = network.tokens[0];
        renderPayment();
        networkChoices.querySelector('[aria-pressed="true"]').focus();
        track("donation_network_select");
      });
      node.setAttribute("aria-pressed", String(network.id === selectedNetwork.id));
      return node;
    }));
    tokenChoices.replaceChildren(...selectedNetwork.tokens.map((token) => {
      const node = button(token, "support-choice", () => {
        selectedToken = token;
        renderPayment();
        tokenChoices.querySelector('[aria-pressed="true"]').focus();
        track("donation_token_select");
      });
      node.setAttribute("aria-pressed", String(token === selectedToken));
      return node;
    }));
    suggestedAmount.textContent = `${copy.amount}: 3 / 5 / 10 ${selectedToken}`;
    warning.textContent = copy.warning.replace("{token}", selectedToken).replace("{network}", selectedNetwork.name);
    address.value = selectedNetwork.address;
    status.textContent = "";
    renderQr();
  }

  function open(source) {
    if (dialog.open) return;
    opener = document.activeElement;
    entryPoint = source;
    renderPayment();
    dialog.showModal();
    track("donation_open");
  }
  dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener("close", () => {
    track("donation_close");
    status.textContent = "";
    opener?.focus();
  });

  document.querySelectorAll(".footer-links").forEach((footer) => {
    footer.prepend(button(copy.link, "support-footer-link", () => open("footer")));
  });

  const completionPanel = document.querySelector("#completionPanel");
  const mainToolbar = document.querySelector("#hintBtn")?.closest(".toolbar");
  const completion = element("div", "support-completion");
  completion.hidden = true;
  completion.dataset.supportCompletion = "";
  const completionText = element("div", "support-completion-text");
  completionText.append(element("strong", "", copy.completion), element("p", "", copy.completionNote));
  completion.append(completionText, button(copy.link, "support-completion-button", () => open("completion")));
  if (completionPanel) completionPanel.append(completion);
  else if (mainToolbar) mainToolbar.after(completion);
  let promptViewed = false;
  const promptObserver = typeof IntersectionObserver === "function" ? new IntersectionObserver((entries) => {
    if (!completion.hidden && !promptViewed && entries.some((entry) => entry.isIntersecting)) {
      promptViewed = true;
      track("donation_prompt_view", { entry_point: "completion" });
    }
  }) : null;
  window.DailyLogicSupport = {
    setPuzzleSolved(solved) {
      completion.hidden = !solved;
      if (solved) promptObserver?.observe(completion);
      else { promptObserver?.unobserve(completion); promptViewed = false; }
    }
  };
})();
