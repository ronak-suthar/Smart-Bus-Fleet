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
  const [originLat, setOriginLat] = useState(0);
  const [originLng, setOriginLng] = useState(0);
  //Map States
  const mapElement = useRef();
  const [map, setMap] = useState({});
  //Component Loading State
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const locationRef = ref(database, "Location");
    onValue(locationRef, (snapshot) => {
      const data = snapshot.val();
      console.log("Location Reterived is : ", data.Latitude, data.Longitude);
      setOriginLat(data.Latitude);
      setOriginLng(data.Longitude);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
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
        bottom: [0, -25]
      };
      const popup = new tt.Popup({ offset: popupOffset }).setHTML(
        "This is you!"
      );
      const element = document.createElement("div");
      element.className = "marker";

      const marker = new tt.Marker({
        draggable: true,
        element: element
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

    return () => map.remove();
  }, [originLat, originLng]);

  return (
    <>
      {!loading && (
        <>
          <h1>Welcome to Passanger Page</h1>
          <h3>
            Vehicle Location is Lat : {originLat} Lng :{originLng}
          </h3>
        </>
      )}
      {map && (
        <div className="app">
          <div ref={mapElement} className="map" />
        </div>
      )}
    </>
  );
};

export default Passanger;
