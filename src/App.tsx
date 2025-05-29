import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";

import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Alert } from "react-bootstrap";
import QuestionsList from "./components/QuestionsList";

function App() {
  const account = useCurrentAccount();

  return (
    <>
      <header>
        <Navbar
          className="bg-dark justify-content-between"
          variant="dark"
          sticky="top"
        >
          <Container>
            <Navbar.Brand>BlockQuiz</Navbar.Brand>
            <ConnectButton />
          </Container>
        </Navbar>
      </header>
      <main>
        <Container>
          <Row className="mt-5">
            {account ? (
              <>
                <Col sm="12" md="5"></Col>
                <Col sm="12" md="7">
                  <QuestionsList />
                </Col>
              </>
            ) : (
              <Col>
                <Alert variant="info" className="text-center">
                  <p className="m-0">
                    Welcome to BlockQuiz! A platform where users can earn
                    rewards in NFTs by completing questions.
                  </p>
                  <p className="m-0">Connect your wallet to start.</p>
                </Alert>
              </Col>
            )}
          </Row>
        </Container>
      </main>
    </>
  );
}

export default App;
