import Dropdown from "react-bootstrap/Dropdown";
import { VscGear } from "react-icons/vsc";

function MenuHeadersExample() {
  const temp = <VscGear style={{ fontSize: "30px" }} />;
  return (
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
        <Dropdown.Item href="#">
          <span style={{ color: "red" }}>Delete</span>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
  1;
}

export default MenuHeadersExample;
