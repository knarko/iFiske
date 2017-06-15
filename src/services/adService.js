angular.module('ifiske.services')
.service('AdService', class AdService {
    constructor(API) {
        this.API = API;
    }

    main() {
        return this.API.get_ads_main().then(ads => {
            return ads.filter(ad => {
                let start = new Date(ad.start).getTime();
                let end = new Date(ad.end).getTime();
                let now = new Date().getTime();
                return start < now && now < end;
            });
        });
    }
});
