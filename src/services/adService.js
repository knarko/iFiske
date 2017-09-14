angular.module('ifiske.services')
  .service('AdService', class AdService {
    constructor(API) {
      this.API = API;
    }

    main() {
      return this.API.get_ads_main().then(ads => {
        return ads.filter(ad => {
          const start = new Date(ad.start).getTime();
          const end = new Date(ad.end).getTime();
          const now = new Date().getTime();
          return start < now && now < end;
        });
      });
    }
  });
