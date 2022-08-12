'use strict';

const LIST_URL = 'https://mate-academy.github.io/phone-catalogue-static/api/phones.json';
const DETAILS_URL = 'https://mate-academy.github.io/phone-catalogue-static/api/phones/';

const request = (url) => {
  return fetch(`${url}`)
    .then(response => {
      if (!response.ok) {
        Promise.reject('response is not ok')
      }

      if (!response.headers.get('content-type').includes('application/json')) {
        Promise.reject(`content type is not supported`)
      }

      return response.json();
    });
};

const getPhoneInfo = (url) => {
  return request(`${DETAILS_URL}${url}.json`);
}

const getPhoneIdList = () => {
  return request(LIST_URL)
    .then(phonesArr => {
      return phonesArr.map(phone => {
        return phone.id;
      });
    })
}

// first recieved promise

getPhoneIdList()
  .then(idArr => {
    console.log(getFirstReceivedDetails(idArr));

    return getFirstReceivedDetails(idArr);
  })
  .then(res => {
    return showNotification('first-received', `First Received`, [res.id])})

const getFirstReceivedDetails = (arr) => {
  const firstPromise = Promise.race(arr.map(id => getPhoneInfo(id)));

  return firstPromise;
};

// all successful promises
getPhoneIdList()
  .then(idArr => {
    console.log(getAllSuccessfulDetails(idArr));

    return getAllSuccessfulDetails(idArr);
  })
  .then(res => showNotification('all-successful', `All Successful`, res));

const getAllSuccessfulDetails = (arr) => {
  return Promise.all(arr.map(el => el));
};

const showNotification = (type, header, textArr) => {
  const list = `
  <div class="${type}">
    <h3>${header}</h3>
      <ul></ul>
  </div> `;

  document.body.insertAdjacentHTML('beforeend', list);

  const ul = document.querySelector('.' + type);

  for (const listText of textArr) {
    ul.insertAdjacentHTML('beforeend', `
    <li>${listText}</li>`);
  }
}