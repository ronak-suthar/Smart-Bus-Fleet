import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert, Container } from 'react-bootstrap'
import { useAuth } from '../Context/AuthContext'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'

export default function Login() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const { login } = useAuth()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    console.log("Login Component called");

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            setError("")
            setLoading(true)
            await login(emailRef.current.value, passwordRef.current.value)
            navigate('/profile')
        } catch {
            setError("Failed to Login")
            console.log('falied to login')
        }

        setLoading(false)
    }

    return (
        <Container className="d-flex align-items-center justify-content-center flex-column"
            style={{ minHeight: "100vh" }}>
            <Card className="signUp">
                <Card.Body>
                    <h2 className="text-center mb-4"><strong>Log In</strong></h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required />
                        </Form.Group>
                        <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" ref={passwordRef} required />
                        </Form.Group>
                        <Button disabled={loading} className="w-100 mt-3" type="submit">
                            Log In
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
                Need an account? <Link to="/signup">Sign Up</Link>
            </div>
        </Container>
    )
}
