// const API_URL = '/example.json?domain=';
const API_URL = 'https://apis.is/isnic?domain=';

// *
// * Leit að lénum á Íslandi gegnum apis.is
// *
const program = (() => {
  let domains;

  function displayloading() {
    const loading = document.createElement('div');
    loading.classList.add('loading');
    const mynd = document.createElement('img');
    mynd.setAttribute('src', 'loading.gif');
    const texti = document.createElement('p');
    const txt = document.createTextNode('Leita að léni...');
    texti.appendChild(txt);

    loading.appendChild(mynd);
    loading.appendChild(texti);

    const container = domains.querySelector('.results');

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    container.appendChild(loading);
  }

  function displayError(error) {
    const container = domains.querySelector('.results');

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    container.appendChild(document.createTextNode(error));
  }

  function displayDomain(domainsList) {
    if (domainsList.length === 0) {
      displayError('Fann ekki vefsíðu');
      return;
    }
    const [{
      address, country, domain, email, expires, lastChange, registered, registrantname,
    }] = domainsList;

    const dl = document.createElement('dl');

    // Lén
    const domainElement = document.createElement('dt');
    domainElement.appendChild(document.createTextNode('Lén'));
    dl.appendChild(domainElement);

    const domainNameElement = document.createElement('dd');
    domainNameElement.appendChild(document.createTextNode(domain));
    dl.appendChild(domainNameElement);

    // Skráð
    const domainRegElement = document.createElement('dt');
    domainRegElement.appendChild(document.createTextNode('Skráð'));
    dl.appendChild(domainRegElement);

    const domainRegDateElement = document.createElement('dd');
    const regDate = new Date(registered).toISOString().split('T')[0];
    domainRegDateElement.appendChild(document.createTextNode(regDate));
    dl.appendChild(domainRegDateElement);

    // Síðast breytt
    const domainChangeElement = document.createElement('dt');
    domainChangeElement.appendChild(document.createTextNode('Síðast breytt'));
    dl.appendChild(domainChangeElement);

    const domainChangeDateElement = document.createElement('dd');
    const changeDate = new Date(lastChange).toISOString().split('T')[0];
    domainChangeDateElement.appendChild(document.createTextNode(changeDate));
    dl.appendChild(domainChangeDateElement);

    // Rennur út
    const domainExpElement = document.createElement('dt');
    domainExpElement.appendChild(document.createTextNode('Rennur út'));
    dl.appendChild(domainExpElement);

    const domainExpDateElement = document.createElement('dd');
    const expDate = new Date(expires).toISOString().split('T')[0];
    domainExpDateElement.appendChild(document.createTextNode(expDate));
    dl.appendChild(domainExpDateElement);

    if (registrantname) {
      // Skráningaraðili
      const ownerElement = document.createElement('dt');
      ownerElement.appendChild(document.createTextNode('Skráningaraðili'));
      dl.appendChild(ownerElement);

      const ownerNameElement = document.createElement('dd');
      ownerNameElement.appendChild(document.createTextNode(registrantname));
      dl.appendChild(ownerNameElement);
    }
    if (email) {
      // Netfang
      const ownerEmailElement = document.createElement('dt');
      ownerEmailElement.appendChild(document.createTextNode('Netfang'));
      dl.appendChild(ownerEmailElement);

      const ownerEmailNameElement = document.createElement('dd');
      ownerEmailNameElement.appendChild(document.createTextNode(email));
      dl.appendChild(ownerEmailNameElement);
    }
    if (address) {
      // Heimilisfang
      const ownerAddressElement = document.createElement('dt');
      ownerAddressElement.appendChild(document.createTextNode('Heimilisfang'));
      dl.appendChild(ownerAddressElement);

      const ownerAddressNameElement = document.createElement('dd');
      ownerAddressNameElement.appendChild(document.createTextNode(address));
      dl.appendChild(ownerAddressNameElement);
    }
    if (country) {
      // Land
      const ownerCountryElement = document.createElement('dt');
      ownerCountryElement.appendChild(document.createTextNode('Land'));
      dl.appendChild(ownerCountryElement);

      const ownerCountryNameElement = document.createElement('dd');
      ownerCountryNameElement.appendChild(document.createTextNode(country));
      dl.appendChild(ownerCountryNameElement);
    }

    const container = domains.querySelector('.results');

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    container.appendChild(dl);
  }

  function fetchData(name) {
    fetch(`${API_URL}${name}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        throw new Error('Óþekkt villa');
      })
      .then((data) => {
        displayDomain(data.results);
      })
      .catch((error) => {
        displayError('Villa við að sækja gögn');
        console.error(error);
      });
  }

  function onSubmit(e) {
    e.preventDefault();
    const input = e.target.querySelector('input');

    if (input.value) {
      displayloading();
      fetchData(input.value);
    } else {
      displayError('Lén verður að vera strengur');
    }
  }

  function init(_domains) {
    domains = _domains;
    const form = domains.querySelector('form');
    form.addEventListener('submit', onSubmit);
  }

  return {
    init,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  const domains = document.querySelector('.domains');
  program.init(domains);
});
