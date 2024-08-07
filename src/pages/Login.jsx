import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import UserContext from "../../UserContext";

export default function Login() {

    const { user, setUser } = useContext(UserContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isActive, setIsActive] = useState(true);


    function authenticate(e) {

        e.preventDefault();
        fetch(`${import.meta.env.VITE_API_URL}/users/login`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({

                email: email,
                password: password

            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);

            if(data.access !== undefined){

                console.log(data.access);
            
                localStorage.setItem('token', data.access);
                retrieveUserDetails(data.access);
                setEmail('');
                setPassword('');

                Swal.fire({
                    title: "Login Successful",
                    icon: "success",
                    text: "You are now logged in."
                })
            
            } else if (data.error == "No Email found") {

                Swal.fire({
                    title: "User Not Found",
                    icon: "error",
                    text: `${email} does not exist.`
                })    

            } else if (data.message == "Email and password do not match") {

                Swal.fire({
                    title: "Login Failed",
                    icon: "error",
                    text: "Incorrect email or password."
                })

            } else {

                Swal.fire({
                    title: "Error!",
                  	icon: "error",
                  	text: "Something went wrong",
                })    
            }
        })
    }

    function retrieveUserDetails(token){

        fetch(`${import.meta.env.VITE_API_URL}/users/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            // console.log(data);

            setUser({
                id: data._id,
                isAdmin: data.isAdmin
            });
        })
    }

    // console.log('User Details:', user);

    useEffect(() => {

        if(email !== '' && password !== ''){
            setIsActive(true);
        }else{
            setIsActive(false);
        }

    }, [email, password]);

    return (    
            (localStorage.length !== 0) ?
            <Navigate to="/posts" />
            :
            <Form onSubmit={(e) => authenticate(e)}>
                <h1 className="my-5 text-center">Login</h1>
                <Form.Group>
                    <Form.Label>Email address</Form.Label>
                    <Form.Control 
                        type="email" 
                        placeholder="Enter email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        placeholder="Password" 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>

                { isActive ? 
                    <Button variant="primary" type="submit" id="loginBtn">
                        Login
                    </Button>
                    : 
                    <Button variant="danger" type="submit" id="loginBtn" disabled>
                        Login
                    </Button>
                }
            </Form>       
    )
}