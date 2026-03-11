import { useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";

function LogInPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            setError("Invalid username or password.");
        }, 1500);
    };

    return (
        <div className="login-page">
            <Container>
                <Row className="justify-content-center">
                    <Col md={6} lg={5}>
                        <Card className="login-card">
                            <Card.Body>
                                <h2 className="text-center mb-2 login-title">Log In</h2>
                                <p className="login-subtitle">Welcome back! Please enter your details.</p>

                                {error && (
                                    <div className="alert alert-danger login-alert">
                                        {error}
                                    </div>
                                )}

                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label className="login-form-label">
                                            Email address
                                        </Form.Label>
                                        <Form.Control
                                            className="login-input"
                                            type="email"
                                            placeholder="Enter email"
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formBasicPassword">
                                        <Form.Label className="login-form-label">
                                            Password
                                        </Form.Label>
                                        <Form.Control
                                            className="login-input"
                                            type="password"
                                            placeholder="Password"
                                        />
                                    </Form.Group>

                                    <Button
                                        className="login-btn"
                                        variant="primary"
                                        type="submit"
                                        disabled={loading}
                                    >
                                        {loading ? "Loading..." : "Log In"}
                                    </Button>
                                </Form>

                                <div className="login-footer">
                                    Don’t have an account? <a href="/signup">Sign Up</a>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default LogInPage;