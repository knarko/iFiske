angular.module('ifiske.models')
  .service('Terms', function($q, localStorage, API) {
    return {
      update: function() {
        // Always update
        return $q.all([
          API.get_terms_of_service(),
          API.get_sms_terms(),
          API.get_contact_info(),
        ]).then(function(result) {
          localStorage.set('tos', result[0]);
          localStorage.set('sms_terms', result[1]);
          localStorage.set('contact_info', result[2]);
        });
      },

      getTermsOfService: function() {
        return localStorage.get('tos');
      },
      getSmsTerms: function() {
        return localStorage.get('sms_terms');
      },
      getContactInfo: function() {
        return localStorage.get('contact_info');
      },
    };
  });
