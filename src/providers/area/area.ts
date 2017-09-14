import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../database/database';
import { ApiProvider } from '../api/api';
import { Geolocation } from '@ionic-native/geolocation';
import { FishProvider } from '../fish/fish';
import * as Fuse from 'fuse.js';

/*
  Generated class for the AreaProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AreaProvider {
  wait: Promise<void>;
  private readonly tables = [{
    name: 'Area',
    primary: 'ID',
    members: {
      ID: 'int',
      orgid: 'int',
      t: 'text',
      kw: 'text',
      note: 'text',
      c1: 'int',
      c2: 'int',
      c3: 'int',
      m1: 'int',
      m2: 'int',
      m3: 'int',
      lat: 'real',
      lng: 'real',
      zoom: 'text',
      pnt: 'int',
      car: 'int',
      eng: 'int',
      hcp: 'int',
      wsc: 'int',
      mod: 'int',
      d: 'text',
      ptab: 'text',
    },
  },
  {
    name: 'Area_Fish',
    primary: 'ID',
    members: {
      ID: 'text',
      aid: 'int',
      fid: 'int',
      amount: 'int',
      comment: 'text',
    },
  },
  {
    name: 'Area_Photos',
    primary: 'ID',
    members: {
      ID: 'int',
      area: 'int', // Area ID
      file: 'int', // File name
      t: 'text', // Title
      d: 'text', // Description
      h: 'int', // Height in pixels
      w: 'int', // Width in pixels
      org: 'int', // Organisation ID
      s: 'int', // Size in bytes
    },
  },
  {
    name: 'Area_Files',
    members: {
      ID: 'int',
      area: 'int', // Area ID
      t: 'text', // File headline
      f: 'text', // Filename
      typ: 'text', // 3 letter file type (e.g. PDF)
      thumb: 'text', // Thumbnail
    },
  },
  ];

  currentLocation: any;
  watch: any;

  constructor(
    private DB: DatabaseProvider,
    private API: ApiProvider,
    private geo: Geolocation,
    private fishProvider: FishProvider,
  ) {
    const p = [];

    this.tables.forEach(table => p.push(DB.initializeTable(table)));

    this.wait = Promise.all(p).then(function (results) {
      for (let i = 0; i < results.length; ++i) {
        if (results[i])
          return this.update('skipWait');
      }
    });

  }
  update(shouldUpdate) {
    if (shouldUpdate)
      return Promise.all([
        this.API.get('get_areas'),
        this.API.get('get_images'),
      ]).then(data => {
        if (shouldUpdate === 'skipWait')
          return data;
        return this.wait.then(function () {
          return data;
        });
      }).then(this.insert);
  }

  insert(data) {
    const areas = data[0];
    const images = data[1];
    const fishArr = [];
    const filesArr = [];
    for (const key in areas) {
      const fishes = areas[key].fish;
      for (const fishKey in fishes) {
        fishArr.push({
          ID: key + '_' + fishKey,
          fid: fishKey,
          aid: key,
          amount: fishes[fishKey][0],
          comment: fishes[fishKey][1],
        });
      }
      // eslint-disable-next-line no-loop-func
      const files = areas[key].files.map(file => {
        file.area = key;
        return file;
      });
      filesArr.push(...files);
    }
    return Promise.all([
      this.DB.populateTable(this.tables[0], areas),
      this.DB.populateTable(this.tables[1], fishArr),
      this.DB.populateTable(this.tables[2], images),
      this.DB.populateTable(this.tables[3], filesArr),
    ]);
  }

  /**
   * Fetches a single Area
   * @param {Integer} id - ID for the requested area
   * @return {Promise<Area>} - A promise for the requested area
   */
  getOne(id: number) {
    return this.wait.then(() => {
      return this.DB.getSingle(`
            SELECT
              Area.*,
              Organization.t AS org,
              CASE WHEN User_Favorite.a IS NULL THEN 0 ELSE 1 END AS favorite
            FROM Area
            LEFT JOIN User_Favorite ON User_Favorite.a = Area.ID
            LEFT JOIN Organization ON Area.orgid = Organization.ID
            WHERE Area.ID = ?
          `, Array.isArray(id) ? id : [id]);
    });
  }

  getAll(countyId?: number) {
    return this.wait.then(() => {
      function selectFish(id) {
        return `Fish_${id}.fishes as fish_${id}`;
      }

      function joinFish(id) {
        return `LEFT JOIN (
              SELECT
                Area_Fish.amount AS amount,
                Area.ID AS aid,
                GROUP_CONCAT(Fish.t, " ") AS fishes
              FROM Area_Fish
              JOIN Fish ON Area_Fish.fid = Fish.ID
              JOIN Area ON Area_Fish.aid = Area.ID
              WHERE Area_Fish.amount = ${id}
              GROUP BY Area_Fish.amount, Area.ID
            ) AS Fish_${id} ON Area.ID = Fish_${id}.aid`;
      }

      return this.DB.getMultiple(`
            SELECT
              Area.*,
              Organization.t AS org,
              Organization.d AS org_d,
              CASE WHEN User_Favorite.a IS NULL THEN 0 ELSE 1 END AS favorite,
              ${selectFish(1)},
              ${selectFish(2)},
              ${selectFish(3)},
              ${selectFish(4)},
              ${selectFish(5)},
              Area_Photos.file AS photo
            FROM Area

            ${joinFish(1)}
            ${joinFish(2)}
            ${joinFish(3)}
            ${joinFish(4)}
            ${joinFish(5)}

            LEFT JOIN Area_Fish ON Area_Fish.aid = Area.ID
            LEFT JOIN Fish ON Area_Fish.fid = Fish.ID
            LEFT JOIN User_Favorite ON User_Favorite.a = Area.ID
            LEFT JOIN Organization ON Area.orgid = Organization.ID
            LEFT JOIN (
              SELECT MIN(rowid), area, file FROM Area_Photos
              GROUP BY area
              ORDER BY rowid ASC
            ) AS Area_Photos ON Area.ID = Area_Photos.area
            ${countyId ? 'WHERE Area.c1 = ? OR Area.c2 = ? OR Area.c3 = ?' : ''}
            GROUP BY Area.ID
          `, countyId ? [countyId, countyId, countyId] : []);
    });
  }

  getPhotos(areaId) {
    return this.wait.then(() => {
      return this.DB.getMultiple(
        [
          'SELECT Area_Photos.*',
          'FROM Area_Photos',
          'WHERE Area_Photos.area = ?',
        ].join(' '), [areaId],
      ).then(function (images) {
        for (let i = 0; i < images.length; ++i) {
          images[i].ratio = images[i].h / images[i].w * 100 + '%';
        }
        return images;
      });
    });
  }

  getFiles(areaId) {
    return this.wait.then(() => {
      return this.DB.getMultiple(
        [
          'SELECT Area_Files.*',
          'FROM Area_Files',
          'WHERE Area_Files.area = ?',
        ].join(' '), [areaId],
      );
    });
  }

  getFishes(aid) {
    return this.wait.then(() => {
      return this.DB.getMultiple(
        [
          'SELECT *',
          'FROM Area_Fish',
          'JOIN Fish ON Area_Fish.fid = Fish.ID',
          'WHERE Area_Fish.aid = ?',
        ].join(' '), [aid],
      );
    });
  }

  /**
   * Searches the database using a query
   *
   * The query is matched to a name and/or keyword
   * @method search
   * @param {String} searchstring - a string to search for  in the area or organization names
   * @param {Integer} countyId - ID for a county to filter on
   * @return {Promise<Area[]>} Promise for the matching areas
   */
  search(searchstring, countyId) {
    let t0;
    if (performance && performance.now) {
      t0 = performance.now();
    }
    if (!this.watch) {
      this.watch = this.startWatch();
    }
    const result = this.getAll(countyId)
      .then(data => data.map(d => {
        for (let i = 1; i < 6; ++i) {
          d['fish_' + i] = d['fish_' + i] && d['fish_' + i].split(' ');
        }
        return d;
      }))
      .then((data) => {
        const options = {
          keys: [{
            name: 't',
            weight: 0.9,
          }, {
            name: 'd',
            weight: 0.4,
          }, {
            name: 'note',
            weight: 0.4,
          }, {
            name: 'kw',
            weight: 0.5,
          }, {
            name: 'org',
            weight: 0.7,
          }, {
            name: 'org_d',
            weight: 0.4,
          }, {
            name: 'fish_1',
            weight: 0.2,
          }, {
            name: 'fish_2',
            weight: 0.3,
          }, {
            name: 'fish_3',
            weight: 0.5,
          }, {
            name: 'fish_4',
            weight: 0.7,
          }, {
            name: 'fish_5',
            weight: 0.9,
          }],
          includeScore: true,
          shouldSort: false,
          threshold: 0.5,
          distance: 10,
          maxPatternLength: 16,
        };

        // Populate Fuse search index
        return new Fuse(data, options);
      })
      .then(fuse => {
        if (searchstring) {
          return fuse.search(searchstring);
        }
        return (fuse as any).list.map(i => {
          return {
            item: i,
            score: 0,
          };
        });
      })
      .then(res => {
        return this.fishProvider.search(searchstring)
          .then(fishes => {
            return fishes.length ? fishes[0].item.t : undefined;
          })
          .then(foundFish => {
            if (this.currentLocation || foundFish) {
              res.forEach(r => {
                if (this.currentLocation) {
                  const distance = this.calculateDistance(
                    r.item.lat,
                    r.item.lng,
                    this.currentLocation.lat,
                    this.currentLocation.lng,
                  );
                  r.item.distance = distance;
                  r.score += this.mapDistance(distance);
                }

                if (foundFish) {
                  for (let i = 1; i < 6; ++i) {
                    const fishArr = r.item['fish_' + i];
                    if (fishArr && fishArr.some(fish => fish.indexOf(foundFish) !== -1)) {
                      r.score -= i / 1500;
                      break;
                    }
                  }
                }
              });
            }
            return res;
          });
      }).then(res => {
        return res.sort((a, b) => {
          const res = a.score - b.score;
          if (res) return res;
          if (a.item.org > b.item.org) {
            return 1;
          } else if (a.item.org < b.item.org) {
            return -1;
          }
          return 0;
        })
          .map(r => r.item);
      });
    result.catch().then(() => {
      if (performance && performance.now) {
        const t1 = performance.now();
        console.log('Searching took:', t1 - t0, 'ms');
      }
    });
    return result;
  }
  private startWatch() {
    this.watch = this.geo.watchPosition({
      timeout: 10000,
      enableHighAccuracy: false,
    });
    this.watch.then(null, err => console.warn(err), position => {
      this.currentLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    });
  }

  private mapDistance(val) {
    return Math.log(1 + val) / Math.log(1 + 1000000) / 100;
  }

  private calculateDistance(lat1, lon1, lat2, lon2) {
    // Implementation shamelessely stolen from http://www.movable-type.co.uk/scripts/latlong.html
    const R = 6371e3; // metres
    const φ1 = lat1 * (Math.PI / 180);
    const φ2 = lat2 * (Math.PI / 180);
    const Δφ = (lat2 - lat1) * (Math.PI / 180);
    const Δλ = (lon2 - lon1) * (Math.PI / 180);

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }
}
