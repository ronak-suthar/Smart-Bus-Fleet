import React, { useState, useEffect, useRef } from "react";
import { database, db } from "../Firebase";
import { ref, onValue } from "firebase/database";
// import { doc, getDoc } from "firebase/firestore";
import * as tt from "@tomtom-international/web-sdk-maps";
import * as ttapi from "@tomtom-international/web-sdk-services";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import "../App.css";

const Passanger = () => {
  //Origin Location
  const [originLat, setOriginLat] = useState(21.143138482443362);
  const [originLng, setOriginLng] = useState(79.08069976530219);
  //Map States
  const mapElement = useRef();
  const [map, setMap] = useState({});
  //Component Loading State
  const [loading, setLoading] = useState(false);

  //Destination Location
  const destinations = [
    {
      lat: 21.144093272544477,
      lng: 79.07784960035025,
    },
    {
      lat: 21.14758599348143,
      lng: 79.0745544471237,
    },
    {
      lat: 21.15240202803346,
      lng: 79.07469475481182,
    },
    {
      lat: 21.156510729909613,
      lng: 79.07504860380347,
    },
  ];

  // useEffect(() => {
  //   const locationRef = ref(database, "Location");
  //   onValue(locationRef, (snapshot) => {
  //     const data = snapshot.val();
  //     console.log("Location Reterived is : ", data.Latitude, data.Longitude);
  //     setOriginLat(data.Latitude);
  //     setOriginLng(data.Longitude);
  //     setLoading(false);
  //   });
  // }, []);

  const convertToPoints = (lngLat) => {
    return {
      point: {
        latitude: lngLat.lat,
        longitude: lngLat.lng,
      },
    };
  };

  const drawRoute = (geoJson, map) => {
    if (map.getLayer("route")) {
      map.removeLayer("route");
      map.removeSource("route");
    }
    map.addLayer({
      id: "route",
      type: "line",
      source: {
        type: "geojson",
        data: geoJson,
      },
      paint: {
        "line-color": "#4a90e2",
        "line-width": 6,
      },
    });
  };

  const addDeliveryMarker = (lngLat, map) => {
    const element = document.createElement("div");
    element.className = "marker-delivery";
    new tt.Marker({
      element: element,
    })
      .setLngLat(lngLat)
      .addTo(map);
  };

  useEffect(() => {
    setLoading(true);
    const origin = {
      lng: originLng,
      lat: originLat,
    };

    let map = tt.map({
      key: process.env.REACT_APP_TOM_TOM_API_KEY,
      container: mapElement.current,
      stylesVisibility: {
        trafficIncidents: true,
        trafficFlow: true,
      },
      center: { lat: originLat, lng: originLng },
      zoom: 14,
      travelMode: "bus",
      computeTravelTimeFor: "all",
      vehicleCommercial: true,
    });
    setMap(map);

    const addMarker = () => {
      const popupOffset = {
        bottom: [0, -25],
      };
      const popup = new tt.Popup({ offset: popupOffset }).setHTML(
        "Vehicle Current Location!"
      );
      const element = document.createElement("div");
      element.className = "marker";

      const marker = new tt.Marker({
        draggable: true,
        element: element,
      })
        .setLngLat([originLng, originLat])
        .addTo(map);

      marker.on("dragend", () => {
        const lngLat = marker.getLngLat();
        setOriginLng(lngLat.lng);
        setOriginLat(lngLat.lat);
      });

      marker.setPopup(popup).togglePopup();
    };
    addMarker();

    const sortDestinations = (locations) => {
      const pointsForDestinations = locations.map((destination) => {
        return convertToPoints(destination);
      });
      const callParameters = {
        key: process.env.REACT_APP_TOM_TOM_API_KEY,
        destinations: pointsForDestinations,
        origins: [convertToPoints(origin)],
      };

      return new Promise((resolve, reject) => {
        ttapi.services
          .matrixRouting(callParameters)
          .then(async (matrixAPIResults) => {
            const results = await matrixAPIResults.matrix[0];
            const resultsArray = results.map((result, index) => {
              console.log(
                `Location ${index + 1},Distance : ${
                  result.response.routeSummary.lengthInMeters / 1000.0
                } kms, Travel Time : ${
                  result.response.routeSummary.travelTimeInSeconds / 60
                } minutes`
              );
              return {
                location: locations[index],
                drivingtime: result.response.routeSummary.travelTimeInSeconds,
              };
            });

            resultsArray.sort((a, b) => {
              return a.drivingtime - b.drivingtime;
            });
            const sortedLocations = resultsArray.map((result) => {
              return result.location;
            });
            resolve(sortedLocations);
          });
      });
    };

    const recalculateRoutes = () => {
      console.log(destinations);
      sortDestinations(destinations).then((sorted) => {
        sorted.unshift(origin);

        ttapi.services
          .calculateRoute({
            key: process.env.REACT_APP_TOM_TOM_API_KEY,
            locations: sorted,
          })
          .then((routeData) => {
            const geoJson = routeData.toGeoJson();
            drawRoute(geoJson, map);
          })
          .catch(console.log("Error"));
      });
    };

    // map.on("click", (e) => {
    //   destinations.push(e.lngLat);
    //   addDeliveryMarker(e.lngLat, map);
    //   recalculateRoutes();
    // });

    destinations.map((loc) => {
      addDeliveryMarker(loc, map);
      recalculateRoutes();
    });

    setLoading(false);
    return () => map.remove();
  }, [originLat, originLng]);

  return (
    <>
      {!loading && (
        <>
          <h1>Welcome to Passanger Page</h1>
          <h5>
            Vehicle Location is Lat : {originLat} Lng :{originLng}
          </h5>
        </>
      )}
      {map && (
        <div className="app">
          <div ref={mapElement} className="map" />
        </div>
      )}
      {
        <div>
          <h4>Location 1,Distance : 0.351 kms, Travel Time : 0.95 minutes</h4>
          <h4>Location 2,Distance : 1 kms, Travel Time : 2.25 minutes</h4>
          <h4>
            Location 3,Distance : 1.54 kms, Travel Time : 3.183333333333333
            minutes
          </h4>
          <h4>
            Location 4,Distance : 2.118 kms, Travel Time : 3.8833333333333333
            minutes
          </h4>
        </div>
      }
    </>
  );
};

export default Passanger;
