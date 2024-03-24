import { useNavigate } from "react-router-dom";
import { supabase } from "../App";
import { useState, useEffect, useRef } from "react";
import GetMessages from "./GetMessages";
import SelectUser from "./SelectUser";
import { SendMessage } from "./SendMessage";
import MenuHeadersExample from "./MenuHeadersExample";
import Dropdown from "react-bootstrap/Dropdown";
import { VscGear } from "react-icons/vsc";
import { MySwal } from "../Profile";

// import Dropdown from "react-bootstrap/Dropdown";

export default function ChatArea() {
  const chatEndRef = useRef(null);
  const [messageTextArea, setmessageTextArea] = useState(null);
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [ActiveChat, setActiveChat] = useState({
    id: "125",
    image: "jkdj",
  });
  const [searching, setSearching] = useState(false);
  const [NewFriends, setNewFriends] = useState([]);
  const [Friends, setFriends] = useState([]);
  const [id, setId] = useState(0);
  const [Messages, setMessages] = useState([{}]);
  const temp = <VscGear style={{ fontSize: "30px" }} />;

  useEffect(() => {
    supabase.auth.getSession().then((data, error) => {
      if (error) {
        console.log(error);
        alert(error);
        return;
      } else if (data.data.session) {
        const id = data.data.session.user.id; //user id
        setId(id);
        GetMessages(id).then((data) => {
          setMessages(data);
        });
        getFriends(id);
        SelectUser(id).then((data) => {
          // console.log(data);
          setUser(data);
        });
      } else {
        MySwal.fire({
          title: "You must Sign in first!",
          text: "if your not a hacker",
        });
        navigate("../Log");
      }
    });
  }, []);

  const getFriends = async (id) => {
    // First, query the user to get the list of friend IDs
    const { data: userData, error } = await supabase
      .from("users")
      .select("Friends")
      .eq("id", id);
    if (error) {
      // alert(error);
      console.log(error);
    }
    const friendIDs = userData[0].Friends;
    // console.log("friend ids:");
    // console.log(friendIDs);
    const { data: friendsInfo, error: friendInfoError } = await supabase
      .from("users")
      .select("*")
      .in("id", friendIDs);

    if (friendInfoError) {
      // console.log("friend info error:");
      console.error(friendInfoError);
      return;
    }
    setFriends(friendsInfo);

    setActiveChat(friendsInfo[0]);
    console.log("Friends of user with ID", id, ":", friendsInfo);
  };
  // console.log("Active chat:", ActiveChat);

  const scrollToBottom = () => {
    chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    // addEventSend();
    supabase
      .channel("message")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        (payload) => {
          // console.log("Change received!", payload);
          GetMessages(id).then((data) => {
            setMessages(data);
            scrollToBottom();
          });
        }
      )
      .subscribe();
  }, [Messages, ActiveChat]);
  // console.log(ActiveChat);

  const clickd = (event) => {
    console.log(event);
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("sendbtn").click();
    }
  };

  const setActive = (id) => {
    const idToSearch = id;

    const index = Friends.findIndex((obj) => obj.id === idToSearch);
    if (index !== -1) {
      // console.log("Object found:", Friends[index]);
      const friend = Friends[index];
      setActiveChat(friend);
    }
  };

  const Search = async () => {
    const email = document.getElementById("searchbar").value;
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email);

    if (data.length == 0) {
      console.log("user not found!");
    } else {
      const friend = data[0];
      const idToSearch = friend.id;
      const index = Friends.findIndex((obj) => obj.id === idToSearch);
      if (index == -1) {
        setNewFriends([friend]);
      } else {
        setNewFriends([]);
        // getFriends();
        const copy = Friends.filter((element) => element.id !== idToSearch);
        setFriends([friend, ...copy]);
        // console.log(copy);
        setNewFriends([]);
      }
    }
  };

  const Add = async () => {
    const FriendsIds = Friends.map((friend) => friend.id);
    const NewFriendsIds = NewFriends.map((newFriend) => newFriend.id);
    const arrayOfIds = [...FriendsIds, ...NewFriendsIds];

    const { data, error } = await supabase
      .from("users")
      .update({
        Friends: arrayOfIds,
      })
      .eq("id", user.id);
    window.location.reload();
  };
  const Remove = async () => {
    MySwal.fire({
      title: "delete",
      text: "sure to delete " + ActiveChat.email,
      icon: "error",
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancle",
    }).then(async (result) => {
      const confirm = result.isConfirmed;
      if (confirm) {
        const FriendsIds = Friends.map((friend) => friend.id);

        const arrayOfIds = FriendsIds.filter((element) => {
          if (element !== ActiveChat.id) {
            return element;
          }
          console.log("i am going to delete this friend " + element);
        });

        const { data, error } = await supabase
          .from("users")
          .update({
            Friends: arrayOfIds,
          })
          .eq("id", user.id);
        window.location.reload();
      } else console.log("not confirmed to delete ");
    });
  };

  return (
    <>
      <section className="bg">
        <div className="container py-5">
          <div className="row">
            <div className="col-md-6 col-lg-5 col-xl-5 mb-4 mb-md-0">
              <h5 className="font-weight-bold mb-3 text-center text-white FontTitle">
                My chates
              </h5>

              <div
                className="card mask-custom"
                style={{
                  backgroundColor: "transparent",
                  textDecoration: "none",
                }}>
                <div className="card-body">
                  <li
                    className="p-2 border-bottom markerless"
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,.3) !important",
                      display: "flex",
                      alignItems: "center",
                    }}>
                    <input
                      id="searchbar"
                      placeholder="Find friends..."
                      className="search-bar"></input>
                    <button
                      id="searchbtn"
                      className=" btn-rounded float-end"
                      onClick={Search}>
                      Find
                    </button>
                  </li>
                  <ul className="list-unstyled mb-0" id="friendsList">
                    {(() => {
                      var buttons = (
                        <>
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={Add}>
                            Add
                          </button>
                        </>
                      );
                      var array = NewFriends;
                      if (NewFriends.length == 0) {
                        buttons = "";
                        array = Friends;
                      }
                      return array.map((friend) => {
                        return (
                          <li
                            key={friend.id}
                            onClick={() => {
                              setActive(friend.id);
                            }}
                            className="p-2 border-bottom"
                            style={{
                              borderBottom:
                                "1px solid rgba(255,255,255,.3) !important",
                            }}>
                            <a
                              href="#!"
                              className="d-flex justify-content-between link-light">
                              <div className="d-flex flex-row">
                                <img
                                  src={friend.image}
                                  alt="avatar"
                                  className="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
                                  width="60"
                                />
                                <div className="pt-1">
                                  <p className="fw-bold mb-0">
                                    {friend.username}
                                  </p>
                                  <p className="small text-white">
                                    {friend.email}
                                  </p>
                                </div>
                              </div>
                              <div className="pt-1">
                                <p className="small text-white mb-1">
                                  {Friends.length}
                                </p>
                                {/* implement the messages unreaded here when pressing the contact name all the messages turns to readed */}
                                {/* <span className="badge bg-danger float-end">
                                1
                              </span> */}
                              </div>
                            </a>
                            {buttons}
                          </li>
                        );
                      });
                    })()}

                    {/* <li
                      className="p-2 border-bottom"
                      style={{
                        borderBottom:
                          "1px solid rgba(255,255,255,.3) !important",
                      }}>
                      <a
                        href="#!"
                        className="d-flex justify-content-between link-light">
                        <div className="d-flex flex-row">
                          <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-8.webp"
                            alt="avatar"
                            className="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
                            width="60"
                          />
                          <div className="pt-1">
                            <p className="fw-bold mb-0">John Doe</p>
                            <p className="small text-white">
                              Hello, Are you there?
                            </p>
                          </div>
                        </div>
                        <div className="pt-1">
                          <p className="small text-white mb-1">Just now</p>
                          <span className="badge bg-danger float-end">1</span>
                        </div>
                      </a>
                    </li>
                   */}
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-7 col-xl-7">
              <Dropdown
                className="d-inline mx-2"
                style={{ float: "right", background: "transparent" }}>
                <Dropdown.Toggle
                  id="dropdown-autoclose-true "
                  align="end"
                  style={{ background: "transparent", border: "none" }}>
                  {temp}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item href="#" onClick={Remove}>
                    <span style={{ color: "red" }}>Delete</span>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <ul
                className="list-unstyled text-white"
                style={{
                  overflow: "hidden",
                  overflowY: "scroll",
                  height: "70vh",
                  scrollbarWidth: "none",
                }}>
                {Messages.map((Message, index) => {
                  // console.log(Message);
                  var element;
                  if (
                    ActiveChat !== undefined &&
                    Message.SenderID == id &&
                    Message.ReceiverID == ActiveChat.id
                  ) {
                    element = (
                      <li
                        className="d-flex justify-content-between mb-4"
                        key={index}>
                        <div
                          className="card mask-custom"
                          style={{
                            backgroundColor: "white",
                            // opacity: "0.7",
                            minWidth: "390px",
                          }}>
                          <div
                            className="card-header d-flex justify-content-between p-3"
                            style={{
                              borderBottom:
                                "1px solid rgba(255,255,255,.3) !important",
                            }}>
                            <p className="fw-bold mb-0">{user.username}</p>
                            <p className="text-light small mb-0">
                              <i
                                className="far fa-clock"
                                style={{ color: "black" }}>
                                {/* {hour + "     "}🕛
        {"     " + month + "/" + day} */}
                              </i>{" "}
                            </p>
                          </div>
                          <div className="card-body">
                            <p className="mb-0">{Message.MessageText}</p>
                          </div>
                        </div>
                        <img
                          src={user.image}
                          alt="avatar"
                          className="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
                          width="60"
                        />
                      </li>
                    );
                    // console.log(element);
                  } else if (
                    ActiveChat !== undefined &&
                    Message.SenderID == ActiveChat.id
                  ) {
                    {
                      element = (
                        <li
                          className="d-flex justify-content-between mb-4"
                          key={index}>
                          <img
                            src={ActiveChat.image}
                            alt="avatar"
                            className="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
                            width="60"
                          />
                          <div
                            className="card mask-custom"
                            style={{
                              backgroundColor: "white",
                              // opacity: "0.7",
                              minWidth: "390px",
                            }}>
                            <div
                              className="card-header d-flex justify-content-between p-3"
                              style={{
                                borderBottom:
                                  "1px solid rgba(255,255,255,.3) !important",
                              }}>
                              <p className="fw-bold mb-0">
                                {ActiveChat.username}
                              </p>
                              <p className="text-light small mb-0">
                                <i
                                  className="far fa-clock"
                                  style={{ color: "black" }}>
                                  {/* {hour + "     "}🕛
                                {"     " + month + "/" + day} */}
                                </i>{" "}
                              </p>
                            </div>
                            <div className="card-body">
                              <p className="mb-0">{Message.MessageText}</p>
                            </div>
                          </div>
                        </li>
                      );
                    }
                    scrollToBottom();
                  }
                  // console.log(Message.SenderID, ActiveChat.id);
                  // console.log(Message.created_at);
                  // const createdAt = new Date(Message.created_at);

                  // const month = createdAt.toLocaleString("default", {
                  //   month: "short",
                  // });
                  // const day = createdAt.getDate();
                  // const hour = createdAt.getHours();

                  // console.log(`${month} ${day}, ${hour}h`);

                  return element;
                })}
                <div ref={chatEndRef} />
              </ul>

              <li
                className="mb-3"
                style={{
                  position: "relative",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                key="index">
                <div
                  className="form-outline form-white"
                  style={{ width: "80%" }}>
                  <textarea
                    style={{
                      height: "70px",
                      textWrap: "wrap",
                      resize: "none",
                      width: "95%",
                      overflow: "hidden scroll",
                      scrollbarWidth: "none",
                    }}
                    type="text"
                    className="form-control"
                    id="textAreaExample3"
                    rows="4"
                    value={messageTextArea || ""}
                    onChange={(e) => {
                      setmessageTextArea(e.target.value);
                    }}
                    onKeyUpCapture={clickd}></textarea>
                </div>
                <button
                  onClick={async () => {
                    await SendMessage(id, ActiveChat.id, messageTextArea);
                    setmessageTextArea("");
                    GetMessages(id).then((data) => {
                      setMessages(data);
                      scrollToBottom();
                    });
                  }}
                  type="button"
                  className="btn btn-light btn-lg btn-rounded float-end"
                  id="sendbtn">
                  Send
                </button>
              </li>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
