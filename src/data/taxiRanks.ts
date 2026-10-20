

export interface TaxiRankListing {
  id: string;
  name: string;
  location: string;
  routes: string[];
  note: string;
  nearbyMetrobus: { stop: string; routes: string; detail: string }[];
}

export const TAXI_RANK_LISTINGS: TaxiRankListing[] = [
  {
    id: 'mtn-noord',
    name: 'MTN Noord',
    location: 'Corner of Noord and Wanderers Street, Johannesburg CBD',
    routes: [
      'North Johannesburg',
      'East Johannesburg',
      'Townships and suburbs in Gauteng',
      'Long-distance to other provinces',
      'Cross-border',
    ],
    note: 'One of the city’s largest and busiest ranks. A main connection point for journeys across Johannesburg and beyond.',
    nearbyMetrobus: [
      {
        stop: 'Joubert Park / Hillbrow',
        routes: '4, 13A, 13B, 13C',
        detail: 'These Metrobus routes run north from Gandhi Square through Joubert Park and Hillbrow, close to Noord Street.',
      },
    ],
  },
  {
    id: 'bree-street',
    name: 'Bree Street',
    location: 'Near Bree Street, Johannesburg CBD',
    routes: [
      'Southern Johannesburg suburbs',
      'Western Johannesburg',
      'Soweto and surrounding townships',
      'Select long-distance destinations',
    ],
    note: 'Mainly serves the southern and western suburbs. Layout is generally easier for first-time users than Noord.',
    nearbyMetrobus: [
      {
        stop: 'Gandhi Square',
        routes: '4, 13A, 13B, 13C',
        detail: 'Gandhi Square Metrobus terminus is in the CBD and walkable from Bree Street.',
      },
    ],
  },
  {
    id: 'wanderers',
    name: 'Wanderers',
    location: '34 Wanderers Street, Braamfontein, about 200 m west of Park Station',
    routes: [
      'Local routes in Gauteng',
      'Interprovincial routes',
      'Business districts and commercial centres',
      'Educational institutions',
    ],
    note: 'Close to Park Station, so it is useful for transfers between taxis and trains.',
    nearbyMetrobus: [
      {
        stop: 'Joubert Park / Hillbrow',
        routes: '4, 13A, 13B, 13C',
        detail: 'Park Station is about 200 m east. Metrobus via Joubert Park and Hillbrow is close by.',
      },
    ],
  },
  {
    id: 'faraday',
    name: 'Faraday',
    location: 'Near Faraday Market, Johannesburg CBD',
    routes: [
      'Local destinations',
      'South-eastern suburbs',
      'Select township routes',
      'Market and commercial districts',
    ],
    note: 'Often less crowded than Noord or Bree. Next to Faraday Market, convenient for shoppers and traders.',
    nearbyMetrobus: [
      {
        stop: 'Gandhi Square',
        routes: '4, 13A, 13B, 13C',
        detail: 'Gandhi Square Metrobus terminus is a short walk north of Faraday Market.',
      },
    ],
  },
];
