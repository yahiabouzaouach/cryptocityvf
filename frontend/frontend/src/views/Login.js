import React, { useEffect, useState } from "react";
import { BladeConnector } from "@bladelabs/blade-web3.js";
import { Navigate, useNavigate } from "react-router-dom";

import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBRow,
  MDBCol,
  MDBCardImage,
} from "mdb-react-ui-kit";

import bgImage from "../assets/images/bg-sign-in.jpg";
import MainNavbar from "../components/MainNavbar";

const Login = () => {
  const [bladeConnector, setBladeConnector] = useState(null);
  const [bladeSigners, setBladeSigners] = useState([]); 
  const [connectedAccountId, setConnectedAccountId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const initBlade = async () => {
      try {
        const connector = await BladeConnector.init({
          name: "Crypto",
          description: "streamline",
        });
        setBladeConnector(connector);
      } catch (error) {
        console.error("Error initializing Blade Wallet:", error);
      }
    };

    initBlade();
  }, []);

  const connectWallet = async () => {
    if (!bladeConnector) {
      console.log("Blade connector is not initialized.");
      return;
    }
    try {
      const params = {
        network: "testnet",
      };
      const pairedAccountIds = await bladeConnector.createSession(params);
      if (pairedAccountIds.length > 0) {
        console.log("Connected Account IDs:", pairedAccountIds);
        setConnectedAccountId(pairedAccountIds[0]);
        const signers = await bladeConnector.getSigners();
        setBladeSigners(signers);
        navigate("/dashboard/profile", { state: { accountId: pairedAccountIds[0] } });
      }
    } catch (error) {
      console.error("Error connecting to Blade Wallet:", error);
    }
  };

  const disconnectWallet = async () => {
    if (!bladeConnector) {
      console.log("Blade connector is not initialized.");
      return;
    }
    try {
      await bladeConnector.killSession();
      setConnectedAccountId("");
      setBladeSigners([]);
      console.log("Disconnected from Blade Wallet.");
    } catch (error) {
      console.error("Error disconnecting Blade Wallet:", error);
    }
  };

  if (connectedAccountId) return <Navigate to="/dashboard/profile" />;

  return (
    <MDBContainer className="my-3">
      <MainNavbar expand="sm" />
      <MDBCard className="my-5 mx-5">
        <MDBRow className="g-0">
          <MDBCol md="6" className="h-full w-full">
            <MDBCardImage
              src={bgImage}
              alt="login form"
              className="rounded-start h-100 w-100 object-cover"
            />
          </MDBCol>

          <MDBCol md="6">
            <MDBCardBody className="d-flex flex-column">
              <div className="d-flex flex-row justify-content-center align-items-center mt-2">
                <MDBIcon
                  fas
                  icon="cubes"
                  size="3x"
                  style={{ color: "#000000", marginRight: "1rem" }}
                />
                <h1
                  className="fw-bold mb-0"
                  style={{ color: "#000000", fontSize: "24px" }}
                >
                  Sign-in
                </h1>
              </div>

              <h5 className="fw-normal my-3 pb-1 text-center">
                Sign into your account
              </h5>
              <div>
                {connectedAccountId ? (
                  <button onClick={disconnectWallet} className="nav-button">
                    Account Id: {connectedAccountId}
                  </button>
                ) : (
                  <button onClick={connectWallet} type="submit"
                  className="btn btn-dark me-3"
                  style={{ backgroundColor: "#007BFF", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "4px", cursor: "pointer" }}
                  >
                    Connect Wallet
                  </button>
                )}
              </div>
            </MDBCardBody>
          </MDBCol>
        </MDBRow>
      </MDBCard>
    </MDBContainer>
  );
};

export default Login;
