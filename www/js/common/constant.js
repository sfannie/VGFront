define([], function(){

  var PC_DOMAIN = 'https://annie.com',
      MOBILE_DOMAIN = 'https://m.annie.com';

  var ENV = _app.env || 'PRD';

  if (origin.indexOf('stg.annie.com') !== -1 || origin.indexOf('m.stg.annie.com') !== -1) {
    ENV = 'UAT';
  } else if (origin === 'http://localhost:8008') {
    ENV = 'DEV';
  }

  var Constant = {
      ENV: ENV,
      PC_DOMAIN: PC_DOMAIN,
      MOBILE_DOMAIN: MOBILE_DOMAIN
  };

  return Constant

});