import React,{useState,useEffect} from 'react'
import { Container, Navbar, Nav } from 'react-bootstrap'
import { useAuth } from '../Context/AuthContext'
import { onAuthStateChanged } from '@firebase/auth';
import { Link, useNavigate } from "react-router-dom"

export default function NavbarPage() {
    const {auth ,logout,currentUser} = useAuth()
    const [loggedIn, setloggedIn] = useState(false)
    const [error, setError] = useState("")
    const navigate = useNavigate()

    console.log('Login Status', loggedIn)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                setloggedIn(true)
                console.log("Navbar Status Changed")
            } else {
                // User is signed out
                // ...
            }
        });
        return unsubscribe;
    }, [])

    async function handleLogout() {
        setError("")
        try {
          await logout()
          navigate("/login")
          setloggedIn(false)
        } catch {
          setError("Failed to log out")
        }
    }

    function logoutBtn() {
        console.log(loggedIn)
        return <>
            <Navbar.Text>
                Signed in as: <a href="#login">{currentUser.email}</a>
            </Navbar.Text>
            <button variant="link" onClick={handleLogout} style={{marginLeft:'2rem'}}>Logout</button>
        </>
    }

    function loginBtn(){
        return <><Link to="/login">Login</Link></>
    }

    return (
        <>
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand href="/">Smart Bus Fleet</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="#home">Home 01</Nav.Link>
                            <Nav.Link href="#link">Feature 01</Nav.Link>
                            <Nav.Link href="#link">Feature 02</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                    <Navbar.Collapse className="me-auto justify-content-end">
                        {/* {loggedin?<Navbar.Text>
                            Signed in as: <a href="#login">userEmail@email.com</a>
                        </Navbar.Text>
                        :   
                        <Link to="/login">Login</Link>
                        } */}
                        {
                            loggedIn == true ? logoutBtn() : loginBtn()
                        }

                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    )
}
