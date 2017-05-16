angular.module('ifiske.services')
.service('AdService', class AdService {
    constructor(API) {
        this.API = API;
    }

    main() {
        return this.API.get_ads_main();
    }
});
