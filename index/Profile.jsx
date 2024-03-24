import { supabase } from "./App";
import { useState, useEffect } from "react";
import "./App.css";
import { Link } from "react-router-dom";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBTypography,
} from "mdb-react-ui-kit";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
export const MySwal = withReactContent(Swal);

export default function EditForm() {
  const [ss, setSs] = useState(true);
  const [user, setUser] = useState({
    image:
      "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp",
    username: "user",
    email: "gmial@.com",
    created_at: "2024-03-22T14:59:09.500615+00:00",
  });

  const signOUt = async () => {
    MySwal.fire({
      title: "Log out!",
      text: "Are you sure to Log out",
      icon: "error",
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: "Log out",
      cancelButtonText: "Cancle",
    }).then((result) => {
      if (result.isConfirmed) {
        supabase.auth.signOut();
        window.location.reload();
      }
    });
  };
  useEffect(() => {
    supabase.auth.getSession().then((data, error) => {
      if (error) {
        console.log(error);
        alert(error);
      } else if (data.data.session) {
        const id = data.data.session.user.id;
        select(id);
      } else {
        MySwal.fire({
          title: "Hello!",
          text: "You need to Sign in Or creat New Acount!",
          icon: "info",
        });
      }
    });
  }, []);
  // supabase.auth.onAuthStateChange((_event, session) => {
  //   const id = session.user.id;
  //   select(id);
  //   // console.log(session);
  // });
  const select = (id) => {
    supabase
      .from("users")
      .select()
      .eq("id", id)
      .then((data, error) => {
        if (error) {
          alert(error);
          console.log(error);
        } else {
          console.log(data);
          setUser(data.data[0]);
        }
      });
  };

  (async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.log(error);
    } else if (data.session == null) {
      setSs(false);
      console.log(data);
    }
  })();

  var contact = 0;
  if (user.Friends == !null) contact = user.Friends.length;

  return (
    <>
      <div
        className="vh-100 bg"
        style={{ backgroundColor: "#eee", color: "white" }}>
        <MDBContainer className="container py-5 h-100">
          <MDBRow className="justify-content-center align-items-center h-100">
            <MDBCol md="12" xl="4">
              <MDBCard
                style={{
                  borderRadius: "15px",
                  background: "transparent",
                  border: "solid gray 2px",
                }}>
                <MDBCardBody className="text-center">
                  <div className="mt-3 mb-4">
                    <MDBCardImage
                      src={user.image}
                      className="rounded-circle"
                      fluid
                      style={{ width: "100px" }}
                    />
                  </div>
                  <MDBTypography tag="h4" style={{ color: "white" }}>
                    {user.username}
                  </MDBTypography>
                  <MDBCardText
                    className="text-muted mb-4"
                    style={{ color: "white" }}>
                    <span className="mx-2" style={{ color: "white" }}>
                      @Programmer |
                    </span>{" "}
                    <a href="#!">{user.email}</a>
                  </MDBCardText>

                  {ss ? (
                    <>
                      <div className="mb-4 pb-2" style={{ color: "white" }}>
                        <button className="btn btn-danger " onClick={signOUt}>
                          Logout
                        </button>
                      </div>
                      <Link
                        className="btn btn-primary p-3"
                        to={"../Chat"}
                        style={{
                          color: "white",
                          textDecoration: "none",
                          fontSize: "1.5rem",
                        }}>
                        Go Chat
                      </Link>
                    </>
                  ) : (
                    // <button rounded size="lg">
                    <Link
                      className="btn btn-success"
                      to={"../log"}
                      style={{ color: "white", textDecoration: "none" }}>
                      Go Sign
                    </Link>
                    // </MDBBtn>
                  )}
                  <div className="d-flex justify-content-between text-center mt-5 mb-2">
                    <div style={{ color: "white" }}>
                      <MDBCardText className="mb-1 h5">
                        {user.created_at.split("T")[0]}
                      </MDBCardText>
                      <MDBCardText className="small text-muted mb-0">
                        <span style={{ color: "white" }}>Created At</span>
                      </MDBCardText>
                    </div>
                    <div className="px-3" style={{ color: "white" }}>
                      <MDBCardText className="mb-1 h5">
                        <span style={{ color: "white" }}>{contact}</span>
                      </MDBCardText>
                      <MDBCardText className="small text-muted mb-0">
                        <span style={{ color: "white" }}>Friends</span>
                      </MDBCardText>
                    </div>
                  </div>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>{" "}
    </>
  );
}
