import {Button, Row, Col} from 'react-bootstrap'
import { Link } from "react-router-dom";

export default function Home(){

	const data = {
        title: "Blog Post App",
        content: "Share Your Story, Inspire the World!",
        destination: "/register",
        buttonLabel: "Register now!"
    }

	return (
		<Row>
			<Col className="text-center mt-5">
				<h1>{data.title}</h1>
				<p>{data.content}</p>
				<Button variant="primary" as={Link} to={data.destination}>{data.buttonLabel}</Button>
			</Col>
		</Row>
	)
}