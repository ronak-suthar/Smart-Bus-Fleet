import React, { useState, useEffect, useRef } from "react";
import { database, db } from "../Firebase";
import { ref, onValue } from "firebase/database";
import { doc, getDoc } from "firebase/firestore";

const NewPassanger = () => {
  const initialState = { lat: 0, lng: 0 };
  const [busRoute, setBusRoute] = useState();
  const [originLocation, setOriginLocation] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [destinationsRoute, setdestinationsRoute] = useState();

  useEffect(() => {
    const locationRef = ref(database, "Location");
    onValue(locationRef, (snapshot) => {
      const data = snapshot.val();
      console.log("Location Reterived is : ", data.Latitude, data.Longitude);
      setOriginLocation({lat: data.Latitude, lng: data.Longitude})
      setLoading(false);
    });
  }, []);

//   useEffect(()=>{
//       if(loading!==false){
//         const getData = async () => {
//             const docRef = doc(db, "routes", "sitaBurdi-civilLines");
//             const docSnap = await getDoc(docRef);
//             if (docSnap.exists()) {
//               console.log("Document data:", docSnap.data(), docSnap.data().route);
//               setdestinationsRoute([...docSnap.data().route]);
//               console.log('Data saved Successfully to state variable locations');
//               console.log('Locations -> ',locations);
//               setloading(false)
//             } else {
//               // doc.data() will be undefined in this case
//               console.log("No such document!");
//             }
//           };
//           getData();
//       }
//       else{
//           console.log('Data still not loaded');
//       }
//   },[])

  return (!loading && <h2>{`Location is Latitude : ${originLocation.lat} and Longitude is ${originLocation.lng}`}</h2>);
};

export default NewPassanger;
