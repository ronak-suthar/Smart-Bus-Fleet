import { React, useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { collection, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../Firebase";
import { doc, onSnapshot } from "firebase/firestore";

const Driver = () => {
  //const { currentUser, db } = useAuth();
  const [userEmail, setuserEmail] = useState("n/a/e");
  const [flagStatus, setflagStatus] = useState(false);
  const [vechicleRoute, setvechicleRoute] = useState("n/a/r");
  const [vehicleNumber, setvehicleNumber] = useState("n/a/vn");

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;

        console.log("User Details are ", user.email);
        setuserEmail(user.email);
        setflagStatus(true);

        const docRef = doc(db, "Users", user.email);

        onSnapshot(docRef, (doc) => {
          console.log(
            "Bus Driver Details",
            doc.data().vehicleNumber,
            doc.data().routeName
          );
          setvechicleRoute(doc.data().routeName);
          setvehicleNumber(doc.data().vehicleNumber);
        });

        // ...
      } else {
        // User is signed out
        // ...
      }
    });
  }, []);

  return (
    <>
      {flagStatus && (
        <div className="driver-page">
          <div>Driver Assignment Details</div>
          <div>Route to be Commuted Today : {vechicleRoute}</div>
          <div>Vechile Assigned : {vehicleNumber}</div>
        </div>
      )}
    </>
  );
};

export default Driver;
