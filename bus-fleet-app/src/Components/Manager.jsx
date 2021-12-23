import { React, useRef, useState } from "react";
import { Form, Button, Card, Alert, Container } from "react-bootstrap";
import { db } from "../Firebase";
import { doc, updateDoc } from "firebase/firestore";

const Manager = () => {
  const driverEmail = useRef();
  const routeName = useRef();
  const vehicleNumber = useRef();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(
      "Assignment Data",
      driverEmail.current.value,
      routeName.current.value,
      vehicleNumber.current.value
    );
    let docRef = doc(db, "Users", driverEmail.current.value);

    updateDoc(docRef, {
      routeName: routeName.current.value,
      vehicleNumber: vehicleNumber.current.value,
    })
      .then(() => {
        console.log("Driver Assigned Sucessfully");
        setError("");
      })
      .catch(() => {
        setError("Error Occured");
      });
  };

  return (
    <div className="managerPage">
      Assign Bus and Route to Drivers
      <Card className="managerPage">
        <Card.Body>
          <h2 className="text-center mb-4">
            <strong>Assign Drivers</strong>
          </h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Driver Email</Form.Label>
              <Form.Control type="email" ref={driverEmail} required />
            </Form.Group>
            <Form.Group id="routeName">
              <Form.Label>Route Name</Form.Label>
              <Form.Control type="text" ref={routeName} required />
            </Form.Group>
            <Form.Group id="vehicleNumber">
              <Form.Label>Vechicle Number</Form.Label>
              <Form.Control type="text" ref={vehicleNumber} required />
            </Form.Group>
            <Button disabled={loading} className="w-100 mt-3" type="submit">
              Submit
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Manager;
